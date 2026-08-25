import type { LoginSchema } from '../types/LoginSchema.ts'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loginByEmail } from '../services/loginByEmail.ts'

const initialState: LoginSchema = {
  email: '',
  password: '',
  isLoading: false,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginByEmail.pending, (state) => {
        state.error = undefined
        state.isLoading = true
      })
      .addCase(loginByEmail.fulfilled, (state) => {
        state.isLoading = false
        state.password = ''
      })
      .addCase(loginByEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { actions: loginActions, reducer: loginReducer } = loginSlice
