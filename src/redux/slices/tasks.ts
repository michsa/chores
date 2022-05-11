import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'
import { Completion, Task, TaskID } from '../../types'
import { State } from '../store'
import { addRecurrence } from '../../utils'

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
      }>
    ) => {
      const task = state.entities[payload.id]!
      const { completion } = payload
      task.completionIds.push(completion.id)
      if (completion.isFull) {
        if (task.settings.recurrence) {
          const nextDate = addRecurrence(
            task.settings.recurrence,
            completion.date
          )
          if (task.settings.scheduled) task.settings.scheduled = nextDate
          if (task.settings.deadline) task.settings.deadline = nextDate
        }
        task.runningPoints = 0
      } else {
        task.runningPoints = (task.runningPoints ?? 0) + completion.points
      }
    },
  },
})

const selectors = tasksAdapter.getSelectors((state: State) => state.tasks)

const { reducer, actions } = tasks
export { reducer, actions, selectors }
