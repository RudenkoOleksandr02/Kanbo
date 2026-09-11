import { rtkApi } from '@/shared/api/rtkApi.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import type { TaskFormValues } from '@/entities/Task'
import type { Tables } from '@/shared/types/database.ts'

type TaskRow = Tables<'tasks'>

type CreateTaskArgs = TaskFormValues & {
  columnId: string
}

const createTaskApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    createTask: build.mutation<TaskRow, CreateTaskArgs>({
      async queryFn({ columnId, title, description, dueDate, labelIds }) {
        const { data, error } = await supabaseClient
          .rpc('create_task_with_labels', {
            p_column_id: columnId,
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

export const { useCreateTaskMutation } = createTaskApi
