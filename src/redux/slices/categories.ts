import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Category } from '../../types'
import { State } from '../store'

const categoriesAdapter = createEntityAdapter<Category>({
  sortComparer: (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
})

const initialState = categoriesAdapter.getInitialState()

const tasks = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    add: categoriesAdapter.addOne,
    remove: categoriesAdapter.removeOne,
    update: categoriesAdapter.updateOne,
    upsert: categoriesAdapter.upsertOne,
    upsertMany: categoriesAdapter.upsertMany,
  },
})

const selectors = categoriesAdapter.getSelectors(
  (state: State) => state.categories
)

const { reducer, actions } = tasks
export { reducer, actions, selectors }
