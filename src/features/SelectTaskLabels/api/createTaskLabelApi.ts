import { rtkApi } from '@/shared/api/rtkApi.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import type { LabelColor, TaskLabel } from '@/entities/TaskLabel'

type CreateTaskLabelArgs = {
  boardId: string
  name: string
  color: LabelColor
}

const createTaskLabelApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    createTaskLabel: build.mutation<TaskLabel, CreateTaskLabelArgs>({
      async queryFn({ boardId, name, color }) {
        const { data, error } = await supabaseClient
          .from('labels')
          .insert({
            board_id: boardId,
            name: name.trim(),
            color,
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

export const { useCreateTaskLabelMutation } = createTaskLabelApi
