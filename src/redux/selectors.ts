import { createSelector } from 'reselect'
import { exists, processFilter, composeTaskFilters } from '../utils'
import {
  TaskWithTags,
  TaskWithTagsAndCompletions,
  CompletionWithTask,
  TaskFilter,
} from '../types'
import { selectors as tasks } from './slices/tasks'
import { selectors as tags } from './slices/tags'
import { selectors as completions } from './slices/completions'
import { selectors as categories } from './slices/categories'
import { selectors as filters } from './slices/filters'

export const getTasks = tasks.selectEntities
export const getTask = tasks.selectById
export const getTaskIds = tasks.selectIds

export const getTags = tags.selectAll
export const getCategories = categories.selectAll

export const getCompletions = completions.selectAll

export const getFilters = filters.selectAll

export const getCompletionsWithTasks = createSelector(
  [getCompletions, tasks.selectEntities, (_, filters: TaskFilter[]) => filters],
  (completions, tasks, filters = []): CompletionWithTask[] =>
    completions
      .map(c => ({ ...c, task: tasks[c.taskId]! }))
      .filter(c => composeTaskFilters(filters)(c.task))
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

export const getFilteredTasks = createSelector(
  [
    filters.selectById,
    tasks.selectAll,
    tags.selectEntities,
    completions.selectEntities,
  ],
  (filter, tasks, tags, completions): TaskWithTagsAndCompletions[] =>
    tasks
      .map(task => ({
        ...task,
        tags: task.tagIds.map(id => tags[id]).filter(exists),
        completions: task.completionIds
          .map(id => completions[id])
          .filter(exists),
      }))
      .filter(task => !filter || processFilter(filter)(task))
)

export const getCompletionIdsForTask = createSelector(
  [tasks.selectById],
  task => task?.completionIds
)
