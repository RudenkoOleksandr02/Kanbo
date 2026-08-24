import { createAsyncThunk } from '@reduxjs/toolkit'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'

interface LoginByEmailProps {
  email: string
  password: string
}

export const loginByEmail = createAsyncThunk<void, LoginByEmailProps, { rejectValue: string }>(
  'login/loginByEmail',
  async (authData, { rejectWithValue }) => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword(authData)

      if (error) {
        return rejectWithValue(error.message)
      }
    } catch {
      return rejectWithValue('Unexpected login error')
    }
  },
)
