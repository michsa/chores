import { createSelector } from 'reselect'
import { selectors as tasks } from './slices/tasks'
import { State } from './store'

export const getTasks = tasks.selectEntities

export const getTaskById = (id: string) => (state: State) => tasks.selectById(state, id)

export const getTaskIds = tasks.selectIds

export const getOrderedTasks = tasks.selectAll

export const getCompletionIdsForTask = (id: string) => createSelector(
  [getTaskById(id)],
  (task) => task?.completions
)
