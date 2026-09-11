import type { Tables } from '@/shared/types/database.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import { boardApi } from '@/entities/Board'
import type { BoardData } from '@/entities/Board'

type TaskRow = Tables<'tasks'>
type BoardTask = BoardData['columns'][number]['tasks'][number]
type ColumnTaskOrder = {
  columnId: string
  tasks: BoardTask[]
}

type SaveTaskOrderArgs = {
  columnOrders: ColumnTaskOrder[]
}

const saveTaskOrderApi = boardApi.injectEndpoints({
  endpoints: (build) => ({
    saveTaskOrder: build.mutation<TaskRow[], SaveTaskOrderArgs>({
      async queryFn({ columnOrders }) {
        const tasksToSave: TaskRow[] = columnOrders.flatMap(({ tasks }) =>
          tasks.map(({ id, column_id, title, description, due_date, position, created_at }) => ({
            id,
            column_id,
            title,
            description,
            due_date,
            position,
            created_at,
          })),
        )

        const { data, error } = await supabaseClient
          .from('tasks')
          .upsert(tasksToSave, { onConflict: 'id' })
          .select()

        if (error) return { error }

        return { data }
      },

      async onQueryStarted({ columnOrders }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          boardApi.util.updateQueryData('getBoard', undefined, (draft) => {
            if (!draft) return

            columnOrders.forEach(({ tasks, columnId }) => {
              const column = draft.columns.find((column) => column.id === columnId)

              if (column) {
                column.tasks = [...tasks]
              }
            })
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const { useSaveTaskOrderMutation } = saveTaskOrderApi
