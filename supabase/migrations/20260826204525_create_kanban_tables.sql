create table public.boards (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    created_at timestamptz not null default now()
);

create table public.columns (
    id uuid primary key default gen_random_uuid(),
    board_id uuid not null references public.boards(id) on delete cascade,
    title text not null,
    position integer not null default 0 check (position >= 0),
    created_at timestamptz not null default now()
);

create table public.tasks (
    id uuid primary key default gen_random_uuid(),
    column_id uuid not null references public.columns(id) on delete cascade,
    title text not null,
    description text,
    due_date date,
    position integer not null default 0 check (position >= 0),
    created_at timestamptz not null default now()
);

create index boards_owner_id_idx on public.boards(owner_id);
create index columns_board_id_idx on public.columns(board_id);
create index tasks_column_id_idx on public.tasks(column_id);
