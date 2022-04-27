import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { omit, without } from 'ramda'
import { TaskID, CompletionID, Completion } from '../../types'

export type CompletionState = {
  byId: Readonly<{ [id: CompletionID]: Completion }>
  ids: CompletionID[]
}

const initialState: CompletionState = { byId: {}, ids: [] }

const completions = createSlice({
  name: 'completions',
  initialState,
  reducers: {
    newCompletion(state, { payload }: PayloadAction<Completion>) {
      state.byId[payload.id] = payload
      state.ids.push(payload.id)
    },
    deleteCompletion(state, { payload }: PayloadAction<TaskID>) {
      state.byId = omit([payload], state.byId)
      state.ids = without([payload], state.ids)
    },
    updateCompletion(
      state,
      { payload }: PayloadAction<Partial<Completion> & { id: TaskID }>,
    ) {
      state.byId[payload.id] = { ...state.byId[payload.id], ...payload }
    }
  },
})

const { actions, reducer } = completions
export { actions, reducer }