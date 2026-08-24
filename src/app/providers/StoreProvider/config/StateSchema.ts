import { rtkApi } from '@/shared/api/rtkApi.ts'
import type { UnknownAction, ReducersMapObject, Reducer, EnhancedStore } from '@reduxjs/toolkit'
import type { LoginSchema } from '@/features/AuthByEmail'

export interface StateSchema {
  loginForm: LoginSchema
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>
}

export type StateSchemaKey = keyof StateSchema

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>
  reduce: (state: StateSchema, action: UnknownAction) => StateSchema
  add: (key: StateSchemaKey, reducer: Reducer) => void
  remove: (key: StateSchemaKey) => void
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager
}
