import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from 'redux-persist'
import {
  configureStore,
  combineReducers,
  AnyAction,
  ThunkAction,
} from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { reducer as tasks } from './slices/tasks'
import { reducer as completions } from './slices/completions'
import { reducer as tags } from './slices/tags'
import { reducer as categories } from './slices/categories'
import { reducer as pins } from './slices/pins'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  migrate: createMigrate(
    {
      // @ts-ignore types for redux-persist migrations are busted https://github.com/rt2zz/redux-persist/issues/1065
      2: (state: State) => state,
    },
    { debug: true }
  ),
}

const reducer = combineReducers({ tasks, completions, tags, categories, pins })
export type State = ReturnType<typeof reducer>

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export type Dispatch = typeof store.dispatch
export type Thunk<R = any> = ThunkAction<R, State, unknown, AnyAction>

export { store, persistor }
