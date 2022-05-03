import { createSelector } from 'reselect'
import { exists } from '../utils'
import { TaskWithTags } from '../types'
import { selectors as tasks } from './slices/tasks'
import { selectors as tags } from './slices/tags'

export const getTasks = tasks.selectEntities
export const getTags = tags.selectAll

export const getTaskWithTags = createSelector(
  [tasks.selectById, tags.selectEntities],
  (task, tags): TaskWithTags | undefined =>
    task
      ? {
          ...task,
          tags: task.tagIds.map(id => tags[id]).filter(exists),
        }
      : undefined
)

export const getTaskIds = tasks.selectIds

export const getOrderedTasks = tasks.selectAll

export const getCompletionIdsForTask = createSelector(
  [tasks.selectById],
  task => task?.completionIds
)
