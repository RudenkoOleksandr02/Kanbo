import { rtkApi } from '@/shared/api/rtkApi.ts'
import type { Tables } from '@/shared/types/database.ts'
import type { TaskFormValues } from '@/entities/Task'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'

type TaskRow = Tables<'tasks'>
type UpdateTaskArgs = TaskFormValues & {
  taskId: string
}

const updateTaskApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    updateTask: build.mutation<TaskRow, UpdateTaskArgs>({
      async queryFn({ taskId, title, description }) {
        const { data, error } = await supabaseClient
          .from('tasks')
          .update({
            title,
            description: description || null,
          })
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

export const { useUpdateTaskMutation } = updateTaskApi
