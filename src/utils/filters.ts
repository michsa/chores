import { reduce, isEmpty } from 'lodash'
import { FilterConfig, Filter, TaskFilter, DateTime } from '../types'
import {
  Task,
  TaskWithCompletions,
  BucketTaskSettings,
  RecurringTaskSettings,
  OneTimeTaskSettings,
} from '../types/task'
import { scheduledDate, toDate } from './datetime'

// ------ generic task filters ------

export const composeTaskFilters =
  <T extends Task>(filters: TaskFilter<T>[]): TaskFilter<T> =>
  task =>
    filters.every(filter => filter(task))

// types

export const isBucket: TaskFilter = (task): task is Task<BucketTaskSettings> =>
  task.settings.type === 'bucket'

export const isRecurring: TaskFilter = (
  task
): task is Task<RecurringTaskSettings> => task.settings.type === 'recurring'

export const isOnce: TaskFilter = (task): task is Task<OneTimeTaskSettings> =>
  task.settings.type === 'once'

// status

export const isInProgress: TaskFilter = task => !!task.runningPoints

export const isFuture: TaskFilter = task => scheduledDate(task) > new Date()

export const hasBeenCompleted: TaskFilter<TaskWithCompletions> = task =>
  task.completions.some(c => c.isFull)

export const isCompleted: TaskFilter<TaskWithCompletions> = task =>
  isOnce(task) && hasBeenCompleted(task)

export const isActive: TaskFilter<TaskWithCompletions> = task =>
  !isFuture(task) && !isCompleted(task)

export const isUpcoming: TaskFilter<TaskWithCompletions> = task =>
  isFuture(task) && !isCompleted(task)

// ------ utils ------

const isInRange = <T>(f: [T?, T?], x: T) =>
  (!f[0] || x >= f[0]) && (!f[1] || x <= f[1])

const isDateInRange = (f: [DateTime?, DateTime?], x: Date) =>
  (!f[0] || x >= toDate(f[0])) && (!f[1] || x <= toDate(f[1]))

// ------ FilterConfig implementation ------

type FilterFunction<K extends keyof FilterConfig> = (
  f: NonNullable<FilterConfig[K]>
) => TaskFilter<TaskWithCompletions>

const filterFunctions: { [K in keyof FilterConfig]: FilterFunction<K> } = {
  tagged: f => task => f.every(task.tagIds.includes),
  notTagged: f => task => !f.some(task.tagIds.includes),

  type: f => task => f.includes(task.settings.type),

  points: f => task =>
    (!f[0] || task.settings.points >= f[0]) &&
    (!f[1] || task.settings.points <= f[1]),
  pointsRemaining: f => task =>
    isInRange(f, task.settings.points - task.runningPoints ?? 0),
  hasRunningPoints: f => task => task.runningPoints > 0 === f,

  priority: f => task => isInRange(f, task.settings.priority),

  isScheduled: f => task =>
    (!!task.settings.scheduled || !!task.settings.deadline) === f,
  hasDeadline: f => task => !!task.settings.deadline === f,
  scheduledAt: f => task => isDateInRange(f, scheduledDate(task)),

  isCompleted: f => task => isCompleted(task) === f,
  lastCompletedAt: f => task =>
    task.completions.some(c => isDateInRange(f, toDate(c.date))),
}

// necessary for types to work
const getFilterFunction = (key: keyof FilterConfig) =>
  filterFunctions[key] as FilterFunction<typeof key>

/** Processes a single FilterConfig into a TaskFilter. */
export const processFilterConfig =
  (config: FilterConfig) => (task: TaskWithCompletions) =>
    reduce(
      config,
      (res, value, key) =>
        res &&
        (value === undefined ||
          getFilterFunction(key as keyof FilterConfig)(value)(task)),
      true
    )

/**
 * Processes a Filter (from state) into a TaskFilter. The filter itself is
 * optional; if it's undefined, the TaskFilter will always return true.
 */
export const processFilter = (filter?: Filter) => (task: TaskWithCompletions) =>
  !filter ||
  isEmpty(filter.configs) ||
  filter.configs.some(config => processFilterConfig(config)(task))
