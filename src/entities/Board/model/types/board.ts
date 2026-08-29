import type { Tables } from '@/shared/types/database.ts'

type BoardRow = Tables<'boards'>
type ColumnRow = Tables<'columns'>
type TaskRow = Tables<'tasks'>

export type BoardData = BoardRow & {
  columns: Array<
    ColumnRow & {
      tasks: TaskRow[]
    }
  >
}
