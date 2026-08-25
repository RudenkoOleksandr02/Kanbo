import { configureStore, type Reducer, type ReducersMapObject } from '@reduxjs/toolkit'
import { rtkApi } from '@/shared/api/rtkApi.ts'
import { createReducerManager } from './reducerManager.ts'
import type { StateSchema } from './StateSchema.ts'
import { loginReducer } from '@/features/AuthByEmail'
import { userReducer } from '@/entities/User'

export function createReduxStore() {
  const rootReducers: ReducersMapObject<StateSchema> = {
    loginForm: loginReducer,
    user: userReducer,
    [rtkApi.reducerPath]: rtkApi.reducer,
  }

  const reducerManager = createReducerManager(rootReducers)

  const store = configureStore({
    reducer: reducerManager.reduce as Reducer<StateSchema>,
    devTools: __IS_DEV__,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rtkApi.middleware),
  })

  return Object.assign(store, { reducerManager })
}

export const store = createReduxStore()

export type AppDispatch = typeof store.dispatch
