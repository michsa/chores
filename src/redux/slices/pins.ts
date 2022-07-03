import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TaskID } from '../../types'

type PinState = TaskID[]

const pins = createSlice({
  name: 'pins',
  initialState: [] as PinState,
  reducers: {
    save(state, action: PayloadAction<PinState>) {
      console.log(`saving pins ${action.payload}`)
      return action.payload
    },
  },
})

const { reducer, actions } = pins
export { reducer, actions }
