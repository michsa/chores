import { createSelector } from 'reselect'
import { exists } from '../utils'
import { selectors as tasks } from './slices/tasks'
import { selectors as tags } from './slices/tags'
import { State } from './store'

export const getTasks = tasks.selectEntities
export const getTags = tags.selectAll

export const getTaskById = (id: string) => (state: State) =>
  tasks.selectById(state, id)

export const getTaskWithTags = createSelector(
  [tasks.selectById, tags.selectEntities],
  (task, tags) =>
    task
      ? {
          ...task,
          tags: task.settings.tags.map(id => tags[id]).filter(exists),
        }
      : undefined
)

export const getTaskIds = tasks.selectIds

export const getOrderedTasks = tasks.selectAll

export const getCompletionIdsForTask = (id: string) =>
  createSelector([getTaskById(id)], task => task?.completions)
