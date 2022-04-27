import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import { reducer as tasks } from './slices/tasks'
import { reducer as completions } from './slices/completions'

const persistConfig = {
  key: 'root',
  storage,
}

const reducer = combineReducers({ tasks, completions })
const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export default store