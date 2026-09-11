create type public.label_color as enum (
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple'
);

create table public.labels (
    id uuid primary key default gen_random_uuid(),
    board_id uuid not null references public.boards(id) on delete cascade,
    name text not null,
    color public.label_color not null,
    created_at timestamptz not null default now(),
    constraint labels_name_trimmed_check check (name = btrim(name)),
    constraint labels_name_length_check check (char_length(name) between 1 and 30)
);

create unique index labels_board_id_lower_name_key
on public.labels (board_id, lower(name));

create index labels_board_id_idx
on public.labels (board_id);

create table public.task_labels (
    task_id uuid not null references public.tasks(id) on delete cascade,
    label_id uuid not null references public.labels(id) on delete cascade,
    primary key (task_id, label_id)
);

create index task_labels_label_id_idx
on public.task_labels (label_id);

alter table public.labels enable row level security;
alter table public.task_labels enable row level security;

revoke all on table public.labels, public.task_labels from anon, authenticated;

grant select, insert on table public.labels to authenticated;
grant select, insert, delete on table public.task_labels to authenticated;

create policy "labels_select_own"
on public.labels
for select
to authenticated
using (
    exists (
        select 1
        from public.boards as board
        where board.id = labels.board_id
          and board.owner_id = (select auth.uid())
    )
);

create policy "labels_insert_own"
on public.labels
for insert
to authenticated
with check (
    exists (
        select 1
        from public.boards as board
        where board.id = labels.board_id
          and board.owner_id = (select auth.uid())
    )
);

create policy "task_labels_select_own"
on public.task_labels
for select
to authenticated
using (
    exists (
        select 1
        from public.tasks as task
        join public.columns as task_column
          on task_column.id = task.column_id
        join public.boards as board
          on board.id = task_column.board_id
        join public.labels as label
          on label.id = task_labels.label_id
         and label.board_id = task_column.board_id
        where task.id = task_labels.task_id
          and board.owner_id = (select auth.uid())
    )
);

create policy "task_labels_insert_own"
on public.task_labels
for insert
to authenticated
with check (
    exists (
        select 1
        from public.tasks as task
        join public.columns as task_column
          on task_column.id = task.column_id
        join public.boards as board
          on board.id = task_column.board_id
        join public.labels as label
          on label.id = task_labels.label_id
         and label.board_id = task_column.board_id
        where task.id = task_labels.task_id
          and board.owner_id = (select auth.uid())
    )
);

create policy "task_labels_delete_own"
on public.task_labels
for delete
to authenticated
using (
    exists (
        select 1
        from public.tasks as task
        join public.columns as task_column
          on task_column.id = task.column_id
        join public.boards as board
          on board.id = task_column.board_id
        join public.labels as label
          on label.id = task_labels.label_id
         and label.board_id = task_column.board_id
        where task.id = task_labels.task_id
          and board.owner_id = (select auth.uid())
    )
);

create function public.ensure_task_label_same_board()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
    v_task_board_id uuid;
    v_label_board_id uuid;
begin
    select task_column.board_id
    into v_task_board_id
    from public.tasks as task
    join public.columns as task_column
      on task_column.id = task.column_id
    where task.id = new.task_id;

    select label.board_id
    into v_label_board_id
    from public.labels as label
    where label.id = new.label_id;

    if v_task_board_id is null
       or v_label_board_id is null
       or v_task_board_id <> v_label_board_id then
        raise exception using
            errcode = '23514',
            message = 'Task and label must belong to the same board';
    end if;

    return new;
end;
$$;

revoke execute on function public.ensure_task_label_same_board() from public;
revoke execute on function public.ensure_task_label_same_board() from anon, authenticated;

create trigger ensure_task_label_same_board_trigger
before insert or update on public.task_labels
for each row
execute function public.ensure_task_label_same_board();

create function public.ensure_task_labels_match_task_board()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
    v_target_board_id uuid;
begin
    if new.column_id is not distinct from old.column_id then
        return new;
    end if;

    select task_column.board_id
    into v_target_board_id
    from public.columns as task_column
    where task_column.id = new.column_id;

    if v_target_board_id is null then
        return new;
    end if;

    if exists (
        select 1
        from public.task_labels as task_label
        join public.labels as label
          on label.id = task_label.label_id
        where task_label.task_id = new.id
          and label.board_id <> v_target_board_id
    ) then
        raise exception using
            errcode = '23514',
            message = 'A labeled task cannot be moved to a different board';
    end if;

    return new;
end;
$$;

revoke execute on function public.ensure_task_labels_match_task_board() from public;
revoke execute on function public.ensure_task_labels_match_task_board() from anon, authenticated;

create trigger ensure_task_labels_match_task_board_trigger
before update of column_id on public.tasks
for each row
execute function public.ensure_task_labels_match_task_board();

create function public.create_task_with_labels(
    p_column_id uuid,
    p_title text,
    p_description text default null,
    p_due_date date default null,
    p_label_ids uuid[] default '{}'::uuid[]
)
returns setof public.tasks
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
    v_board_id uuid;
    v_task public.tasks%rowtype;
    v_label_ids uuid[] := coalesce(p_label_ids, '{}'::uuid[]);
begin
    if nullif(btrim(p_title), '') is null then
        raise exception using
            errcode = '22023',
            message = 'Task title is required';
    end if;

    select task_column.board_id
    into v_board_id
    from public.columns as task_column
    join public.boards as board
      on board.id = task_column.board_id
    where task_column.id = p_column_id
      and board.owner_id = (select auth.uid());

    if not found then
        raise exception using
            errcode = 'P0002',
            message = 'Column not found or access denied';
    end if;

    if exists (
        select 1
        from unnest(v_label_ids) as requested(label_id)
        left join public.labels as label
          on label.id = requested.label_id
         and label.board_id = v_board_id
        where requested.label_id is null
           or label.id is null
    ) then
        raise exception using
            errcode = '22023',
            message = 'Every label must belong to the task board';
    end if;

    insert into public.tasks (
        column_id,
        title,
        description,
        due_date
    )
    values (
        p_column_id,
        btrim(p_title),
        nullif(btrim(p_description), ''),
        p_due_date
    )
    returning * into v_task;

    insert into public.task_labels (task_id, label_id)
    select v_task.id, requested.label_id
    from (
        select distinct label_id
        from unnest(v_label_ids) as input(label_id)
    ) as requested;

    return next v_task;
    return;
end;
$$;

create function public.update_task_with_labels(
    p_task_id uuid,
    p_title text,
    p_description text default null,
    p_due_date date default null,
    p_label_ids uuid[] default '{}'::uuid[]
)
returns setof public.tasks
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
    v_board_id uuid;
    v_task public.tasks%rowtype;
    v_label_ids uuid[] := coalesce(p_label_ids, '{}'::uuid[]);
begin
    if nullif(btrim(p_title), '') is null then
        raise exception using
            errcode = '22023',
            message = 'Task title is required';
    end if;

    select task_column.board_id
    into v_board_id
    from public.tasks as task
    join public.columns as task_column
      on task_column.id = task.column_id
    join public.boards as board
      on board.id = task_column.board_id
    where task.id = p_task_id
      and board.owner_id = (select auth.uid())
    for update of task;

    if not found then
        raise exception using
            errcode = 'P0002',
            message = 'Task not found or access denied';
    end if;

    if exists (
        select 1
        from unnest(v_label_ids) as requested(label_id)
        left join public.labels as label
          on label.id = requested.label_id
         and label.board_id = v_board_id
        where requested.label_id is null
           or label.id is null
    ) then
        raise exception using
            errcode = '22023',
            message = 'Every label must belong to the task board';
    end if;

    update public.tasks
    set title = btrim(p_title),
        description = nullif(btrim(p_description), ''),
        due_date = p_due_date
    where id = p_task_id
    returning * into v_task;

    delete from public.task_labels
    where task_id = p_task_id;

    insert into public.task_labels (task_id, label_id)
    select p_task_id, requested.label_id
    from (
        select distinct label_id
        from unnest(v_label_ids) as input(label_id)
    ) as requested;

    return next v_task;
    return;
end;
$$;

revoke execute on function public.create_task_with_labels(uuid, text, text, date, uuid[]) from public;
revoke execute on function public.create_task_with_labels(uuid, text, text, date, uuid[]) from anon;
grant execute on function public.create_task_with_labels(uuid, text, text, date, uuid[]) to authenticated;

revoke execute on function public.update_task_with_labels(uuid, text, text, date, uuid[]) from public;
revoke execute on function public.update_task_with_labels(uuid, text, text, date, uuid[]) from anon;
grant execute on function public.update_task_with_labels(uuid, text, text, date, uuid[]) to authenticated;
