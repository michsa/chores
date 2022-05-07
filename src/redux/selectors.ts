import { createSelector } from 'reselect'
import { exists } from '../utils'
import { TaskWithTags } from '../types'
import { selectors as tasks } from './slices/tasks'
import { selectors as tags } from './slices/tags'
import { selectors as categories } from './slices/categories'

export const getTasks = tasks.selectEntities
export const getTask = tasks.selectById
export const getTaskIds = tasks.selectIds
export const getOrderedTasks = tasks.selectAll

export const getTags = tags.selectAll
export const getCategories = categories.selectAll

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

export const getOrderedTasksWithTags = createSelector(
  [tasks.selectAll, tags.selectEntities],
  (tasks, tags): TaskWithTags[] =>
    tasks.map(task => ({
      ...task,
      tags: task.tagIds.map(id => tags[id]).filter(exists),
    }))
)

export const getCompletionIdsForTask = createSelector(
  [tasks.selectById],
  task => task?.completionIds
)
