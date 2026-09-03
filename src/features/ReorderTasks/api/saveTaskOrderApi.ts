import type { Tables } from '@/shared/types/database.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import { boardApi } from '@/entities/Board'

type TaskRow = Tables<'tasks'>
type SaveTaskOrderArgs = {
  columnId: string
  tasks: TaskRow[]
}

const saveTaskOrderApi = boardApi.injectEndpoints({
  endpoints: (build) => ({
    saveTaskOrder: build.mutation<TaskRow[], SaveTaskOrderArgs>({
      async queryFn({ tasks }) {
        const { data, error } = await supabaseClient
          .from('tasks')
          .upsert(tasks, { onConflict: 'id' })
          .select()

        if (error) return { error }

        return { data }
      },

      async onQueryStarted({ columnId, tasks }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          boardApi.util.updateQueryData('getBoard', undefined, (draft) => {
            if (!draft) return

            const column = draft.columns.find((column) => column.id === columnId)

            if (column) {
              column.tasks = [...tasks]
            }
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
