begin;

set local request.jwt.claim.sub =
  '313e6b0a-bdc1-44a4-b132-c25ea548dad0';

set local role authenticated;

with
attempted_tasks as (
  delete from public.tasks
  where title = 'User A task'
  returning id
),
attempted_columns as (
  delete from public.columns
  where title = 'Not started'
  returning id
),
attempted_boards as (
  delete from public.boards
  where title = 'User A board'
  returning id
)
select
  (select count(*) from attempted_boards) as deleted_boards,
  (select count(*) from attempted_columns) as deleted_columns,
  (select count(*) from attempted_tasks) as deleted_tasks;

rollback;