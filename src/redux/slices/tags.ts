import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Tag } from '../../types'
import { State } from '../store'

const tagsAdapter = createEntityAdapter<Tag>()

const initialState = tagsAdapter.getInitialState()

const tasks = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    add: tagsAdapter.addOne,
    remove: tagsAdapter.removeOne,
    update: tagsAdapter.updateOne,
    upsert: tagsAdapter.upsertOne,
    upsertMany: tagsAdapter.upsertMany,
  },
})

const selectors = tagsAdapter.getSelectors((state: State) => state.tags)

const { reducer, actions } = tasks
export { reducer, actions, selectors }
