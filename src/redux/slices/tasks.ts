import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Task } from '../../types'

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
  }
})

const { actions, reducer } = tasks
export { actions, reducer }

