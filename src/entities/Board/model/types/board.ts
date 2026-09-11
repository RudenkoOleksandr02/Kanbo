import type { Tables } from '@/shared/types/database.ts'

type BoardRow = Tables<'boards'>
type ColumnRow = Tables<'columns'>
type TaskRow = Tables<'tasks'>
type LabelRow = Tables<'labels'>

export type BoardData = BoardRow & {
  labels: LabelRow[]
  columns: Array<
    ColumnRow & {
      tasks: Array<
        TaskRow & {
          labels: LabelRow[]
        }
      >
    }
  >
}
