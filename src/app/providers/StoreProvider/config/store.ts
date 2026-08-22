import {
  configureStore,
  type EnhancedStore,
  type Reducer,
  type ReducersMapObject,
} from '@reduxjs/toolkit'
import { counterReducer } from '@/entities/Counter'
import { rtkApi } from '@/shared/api/rtkApi.ts'
import { createReducerManager } from './reducerManager.ts'
import type { ReducerManager, StateSchema } from './StateSchema.ts'

export function createReduxStore(): EnhancedStore<StateSchema> & {
  reducerManager: ReducerManager
} {
  const rootReducers: ReducersMapObject<StateSchema> = {
    counter: counterReducer,
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

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch']
