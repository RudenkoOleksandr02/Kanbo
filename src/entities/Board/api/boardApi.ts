import { rtkApi } from '@/shared/api/rtkApi.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import type { BoardData } from '../model/types/board.ts'

export const boardApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getBoard: build.query<BoardData | null, void>({
      async queryFn() {
        const { data, error } = await supabaseClient
          .from('boards')
          .select(
            `
            id,
            owner_id,
            title,
            description,
            created_at,
            labels (
              id,
              board_id,
              name,
              color,
              created_at
            ),
            columns (
              id,
              board_id,
              title,
              position,
              created_at,
              tasks (
                id,
                column_id,
                title,
                description,
                due_date,
                position,
                created_at,
                labels (
                  id,
                  board_id,
                  name,
                  color,
                  created_at
                )
              )
            )
          `,
          )
          .order('position', {
            referencedTable: 'columns',
            ascending: true,
          })
          .order('position', {
            referencedTable: 'columns.tasks',
            ascending: true,
          })
          .limit(1)
          .maybeSingle()

        if (error) return { error }

        return { data }
      },
      providesTags: ['Board'],
    }),
  }),
})

export const { useGetBoardQuery } = boardApi
