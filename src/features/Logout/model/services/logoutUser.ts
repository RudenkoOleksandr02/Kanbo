import { createAsyncThunk } from '@reduxjs/toolkit'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'logout/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabaseClient.auth.signOut()

      if (error) return rejectWithValue(error.message)
    } catch {
      return rejectWithValue('Unexpected logout error')
    }
  },
)
