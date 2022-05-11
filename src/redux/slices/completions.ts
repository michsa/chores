import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Completion } from '../../types'
import { State } from '../store'

const completionsAdapter = createEntityAdapter<Completion>()

const initialState = completionsAdapter.getInitialState()
export type TaskState = typeof initialState

const completions = createSlice({
  name: 'completions',
  initialState,
  reducers: {
    add: completionsAdapter.addOne,
    remove: completionsAdapter.removeOne,
    removeMany: completionsAdapter.removeMany,
    update: completionsAdapter.updateOne,
  },
})

const selectors = completionsAdapter.getSelectors(
  (state: State) => state.completions
)

const { reducer, actions } = completions
export { reducer, actions, selectors }
