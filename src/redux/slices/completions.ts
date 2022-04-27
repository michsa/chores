import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Task } from '../../types'
import { State } from '../store'

const completionsAdapter = createEntityAdapter<Task>()

const initialState = completionsAdapter.getInitialState()
export type TaskState = typeof initialState

const completions = createSlice({
  name: 'completions',
  initialState,
  reducers: {
    add: completionsAdapter.addOne,
    remove: completionsAdapter.removeOne,
    update: completionsAdapter.updateOne,
  },
})

const selectors = completionsAdapter.getSelectors(
  (state: State) => state.completions
)

const { reducer, actions } = completions
export { reducer, actions, selectors }
