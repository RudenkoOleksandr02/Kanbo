import type { Tables } from '@/shared/types/database.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import { boardApi } from '@/entities/Board'

type TaskRow = Tables<'tasks'>
type ColumnTaskOrder = {
  columnId: string
  tasks: TaskRow[]
}

type SaveTaskOrderArgs = {
  columnOrders: ColumnTaskOrder[]
}

const saveTaskOrderApi = boardApi.injectEndpoints({
  endpoints: (build) => ({
    saveTaskOrder: build.mutation<TaskRow[], SaveTaskOrderArgs>({
      async queryFn({ columnOrders }) {
        const tasksToSave = columnOrders.flatMap(({ tasks }) => tasks)

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
