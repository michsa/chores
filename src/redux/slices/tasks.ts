import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Task } from '../../types'
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
    upsert: tasksAdapter.upsertOne
  }
})

const selectors = tasksAdapter.getSelectors((state: State) => state.tasks)

const { reducer, actions } = tasks
export { reducer, actions, selectors }
