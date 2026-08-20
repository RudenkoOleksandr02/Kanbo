import {
  configureStore,
  type EnhancedStore,
  type Reducer,
  type ReducersMapObject,
} from '@reduxjs/toolkit'
import { counterReducer } from '@/entities/Counter'
import { rtkApi } from '@/shared/api/rtkApi.ts'
import { createReducerManager } from './reducerManager.ts'
import { $api } from '@/shared/api/api.ts'
import type { ReducerManager, StateSchema, ThunkExtraArg } from './StateSchema.ts'

export function createReduxStore(
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>,
): EnhancedStore<StateSchema> & { reducerManager: ReducerManager } {
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    counter: counterReducer,
    [rtkApi.reducerPath]: rtkApi.reducer,
  }

  const reducerManager = createReducerManager(rootReducers)

  const extraArg: ThunkExtraArg = {
    api: $api,
  }

  const store = configureStore({
    reducer: reducerManager.reduce as Reducer<StateSchema>,
    devTools: __IS_DEV__,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: extraArg,
        },
      }).concat(rtkApi.middleware),
  })

  return Object.assign(store, { reducerManager })
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch']
