import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'
import { Completion, Task, TaskID, DateTime } from '../../types'
import { State } from '../store'

const tasksAdapter = createEntityAdapter<Task>()

const initialState = tasksAdapter.getInitialState()
export type TaskState = typeof initialState

const tasks = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    add: tasksAdapter.addOne,
    remove: tasksAdapter.removeOne,
    update: tasksAdapter.updateOne,
    upsert: tasksAdapter.upsertOne,
    complete: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: TaskID
        completion: Completion
        nextDate?: DateTime
      }>
    ) => {
      const task = state.entities[payload.id]!
      const { settings } = task
      const { completion, nextDate } = payload
      task.completionIds.push(completion.id)
      if (completion.isFull) {
        task.runningPoints = 0
        if (nextDate) {
          if (settings.scheduled) settings.scheduled = nextDate
          if (settings.deadline) settings.deadline = nextDate
        }
      } else {
        task.runningPoints += completion.points
      }
    },
  },
})

const selectors = tasksAdapter.getSelectors((state: State) => state.tasks)

const { reducer, actions } = tasks
export { reducer, actions, selectors }
