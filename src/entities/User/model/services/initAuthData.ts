import { createAsyncThunk } from '@reduxjs/toolkit'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'
import type { User } from '@supabase/supabase-js'

export const initAuthData = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'user/initAuthData',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseClient.auth.getSession()

      if (error) {
        return rejectWithValue(error.message)
      }

      return data.session?.user ?? null
    } catch {
      return rejectWithValue('Unexpected user error')
    }
  },
)
