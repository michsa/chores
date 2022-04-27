import { selectors as tasks } from './slices/tasks'
import { createSelector } from 'reselect'

export const getTasks = tasks.selectEntities

export const getTaskById = tasks.selectById

export const getTaskIds = tasks.selectIds

export const getOrderedTasks = tasks.selectAll

export const getCompletionIdsForTask = createSelector(
  [getTaskById],
  (task) => task?.completions
)
