import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { reducer as tasks } from './slices/tasks'
import { reducer as completions } from './slices/completions'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const reducer = combineReducers({ tasks, completions })
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

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export { store, persistor }
