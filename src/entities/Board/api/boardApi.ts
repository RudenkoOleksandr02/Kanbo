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
          *,
            columns (
              *,
              tasks (*)
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
