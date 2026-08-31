import { rtkApi } from '@/shared/api/rtkApi.ts'
import type { Tables } from '@/shared/types/database.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'

type TaskRow = Tables<'tasks'>
type DeleteTaskArgs = {
  taskId: string
}

const deleteTaskApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    deleteTask: build.mutation<TaskRow, DeleteTaskArgs>({
      async queryFn({ taskId }) {
        const { data, error } = await supabaseClient
          .from('tasks')
          .delete()
          .eq('id', taskId)
          .select()
          .single()

        if (error) return { error }

        return { data }
      },
      invalidatesTags: (_result, error) => (error ? [] : ['Board']),
    }),
  }),
})

export const { useDeleteTaskMutation } = deleteTaskApi
