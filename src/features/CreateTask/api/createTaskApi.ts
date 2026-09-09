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
      async queryFn({ columnId, title, description, dueDate }) {
        const { data, error } = await supabaseClient
          .from('tasks')
          .insert({
            column_id: columnId,
            title,
            description: description || null,
            due_date: dueDate || null,
          })
          .select()
          .single()

        if (error) return { error }

        return { data }
      },
      invalidatesTags: (_result, error) => (error ? [] : ['Board']),
    }),
  }),
})

export const { useCreateTaskMutation } = createTaskApi
