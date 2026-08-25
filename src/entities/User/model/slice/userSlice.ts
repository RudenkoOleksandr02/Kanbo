import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserSchema } from '../types/UserSchema.ts'
import type { User } from '@supabase/supabase-js'
import { initAuthData } from '../services/initAuthData.ts'

const initialState: UserSchema = {
  authData: null,
  authReady: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<User | null>) => {
      state.authData = action.payload
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuthData.pending, (state) => {
        state.authReady = false
        state.error = undefined
      })
      .addCase(initAuthData.fulfilled, (state, action) => {
        state.authData = action.payload
        state.authReady = true
        state.error = undefined
      })
      .addCase(initAuthData.rejected, (state, action) => {
        state.authData = null
        state.authReady = true
        state.error = action.payload
      })
  },
})

export const { actions: userActions, reducer: userReducer } = userSlice
