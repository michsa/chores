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
import { mapValues } from 'lodash'

import { reducer as tasks } from './slices/tasks'
import { reducer as completions } from './slices/completions'
import { reducer as tags } from './slices/tags'
import { reducer as categories } from './slices/categories'
import { reducer as pins } from './slices/pins'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 3,
  migrate: createMigrate(
    {
      // @ts-ignore types for redux-persist migrations are busted https://github.com/rt2zz/redux-persist/issues/1065
      3: (state: State) => ({
        ...state,
        tasks: {
          ...state.tasks,
          entities: mapValues(
            state.tasks.entities,
            // @ts-ignore
            ({ settings: { notes, description, ...settings }, ...entity }) => {
              console.log('migrating task', {
                name: settings.name,
                notes,
                description,
              })
              return {
                ...entity,
                settings: {
                  notes: notes || description,
                  ...settings,
                },
              }
            }
          ),
        },
      }),
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
