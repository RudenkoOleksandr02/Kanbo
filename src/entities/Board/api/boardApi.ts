import { rtkApi } from '@/shared/api/rtkApi.ts'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import type { BoardData } from '../model/types/board.ts'

const boardApi = rtkApi.injectEndpoints({
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
