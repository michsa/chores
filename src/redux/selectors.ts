import { createSelector } from 'reselect'
import { exists } from '../utils'
import {
  TaskWithTags,
  TaskWithTagsAndCompletions,
  CompletionWithTask,
  Filter,
  FilterWithCompletions,
} from '../types'
import { selectors as tasks } from './slices/tasks'
import { selectors as tags } from './slices/tags'
import { selectors as completions } from './slices/completions'
import { selectors as categories } from './slices/categories'
import { composeFilters } from './filters'

export const getTasks = tasks.selectEntities
export const getTask = tasks.selectById
export const getTaskIds = tasks.selectIds

export const getTags = tags.selectAll
export const getCategories = categories.selectAll

export const getCompletions = completions.selectAll

export const getCompletionsWithTasks = createSelector(
  [getCompletions, tasks.selectEntities, (_, filters: Filter[]) => filters],
  (completions, tasks, filters = []): CompletionWithTask[] =>
    completions
      .map(c => ({ ...c, task: tasks[c.taskId]! }))
      .filter(c => composeFilters(filters)(c.task))
)

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

export const getTaskCompletions = createSelector(
  [tasks.selectById, completions.selectEntities],
  (task, completions) =>
    task ? task.completionIds.map(id => completions[id]).filter(exists) : []
)

export const getOrderedTasks = createSelector(
  [
    tasks.selectAll,
    tags.selectEntities,
    completions.selectEntities,
    (_, filters: FilterWithCompletions[]) => filters,
  ],
  (tasks, tags, completions, filters = []): TaskWithTagsAndCompletions[] =>
    tasks
      .map(task => ({
        ...task,
        tags: task.tagIds.map(id => tags[id]).filter(exists),
        completions: task.completionIds
          .map(id => completions[id])
          .filter(exists),
      }))
      .filter(composeFilters(filters))
)

export const getCompletionIdsForTask = createSelector(
  [tasks.selectById],
  task => task?.completionIds
)
