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
      async queryFn({ taskId, title, description, dueDate, labelIds }) {
        const { data, error } = await supabaseClient
          .rpc('update_task_with_labels', {
            p_task_id: taskId,
            p_title: title,
            p_description: description || null,
            p_due_date: dueDate || null,
            p_label_ids: labelIds,
          })
          .single()

        if (error) return { error }

        return { data }
      },
      invalidatesTags: (_result, error) => (error ? [] : ['Board']),
    }),
  }),
})

export const { useUpdateTaskMutation } = updateTaskApi
