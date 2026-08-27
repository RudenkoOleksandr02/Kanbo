alter table public.boards enable row level security;
alter table public.columns enable row level security;
alter table public.tasks enable row level security;



revoke all on table
    public.boards,
    public.columns,
    public.tasks
    from anon, authenticated;

grant select, insert, update, delete on table
    public.boards,
    public.columns,
    public.tasks
    to authenticated;



create policy "boards_select_own"
on public.boards
for select
to authenticated
using (owner_id = (select auth.uid()));

create policy "boards_insert_own"
on public.boards
for insert
to authenticated
with check (owner_id = (select auth.uid()));

create policy "boards_update_own"
on public.boards
for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "boards_delete_own"
on public.boards
for delete
to authenticated
using (owner_id = (select auth.uid()));



create policy "columns_select_own"
on public.columns
for select
to authenticated
using (
    exists (
        select 1
        from public.boards as board
        where board.id = columns.board_id
        and board.owner_id = (select auth.uid())
    )
);

create policy "columns_insert_own"
on public.columns
for insert
to authenticated
with check (
    exists (
        select 1
        from public.boards as board
        where board.id = columns.board_id
        and board.owner_id = (select auth.uid())
    )
);

create policy "columns_update_own"
on public.columns
for update
to authenticated
using (
    exists (
        select 1
        from public.boards as board
        where board.id = columns.board_id
        and board.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.boards as board
        where board.id = columns.board_id
        and board.owner_id = (select auth.uid())
    )
);

create policy "columns_delete_own"
on public.columns
for delete
to authenticated
using (
    exists (
        select 1
        from public.boards as board
        where board.id = columns.board_id
        and board.owner_id = (select auth.uid())
    )
);



create policy "tasks_select_own"
on public.tasks
for select
to authenticated
using (
    exists (
        select 1
        from public.columns as task_column
        join public.boards as board
        on board.id = task_column.board_id
        where task_column.id = tasks.column_id
        and board.owner_id = (select auth.uid())
    )
);

create policy "tasks_insert_own"
on public.tasks
for insert
to authenticated
with check (
    exists (
        select 1
        from public.columns as task_column
        join public.boards as board
        on board.id = task_column.board_id
        where task_column.id = tasks.column_id
        and board.owner_id = (select auth.uid())
    )
);

create policy "tasks_update_own"
on public.tasks
for update
to authenticated
using (
    exists (
        select 1
        from public.columns as task_column
        join public.boards as board
        on board.id = task_column.board_id
        where task_column.id = tasks.column_id
        and board.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.columns as task_column
        join public.boards as board
        on board.id = task_column.board_id
        where task_column.id = tasks.column_id
        and board.owner_id = (select auth.uid())
    )
);

create policy "tasks_delete_own"
on public.tasks
for delete
to authenticated
using (
    exists (
        select 1
        from public.columns as task_column
        join public.boards as board
        on board.id = task_column.board_id
        where task_column.id = tasks.column_id
        and board.owner_id = (select auth.uid())
    )
);
