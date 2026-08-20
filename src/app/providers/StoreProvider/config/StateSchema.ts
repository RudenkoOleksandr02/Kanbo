import type { CounterSchema } from '@/entities/Counter'
import { rtkApi } from '@/shared/api/rtkApi.ts'
import type { UnknownAction, ReducersMapObject, Reducer, EnhancedStore } from '@reduxjs/toolkit'
import type { AxiosInstance } from 'axios'

export interface StateSchema {
  counter: CounterSchema
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>

  // async reducers
  /*loginForm?: LoginSchema*/
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

export interface ThunkExtraArg {
  api: AxiosInstance
}

export interface ThunkConfig<T> {
  rejectValue: T
  extra: ThunkExtraArg
  state: StateSchema
}
