import { mapValues, reduce } from 'lodash'
import { TagID, TaskType, DateTime, TaskWithCompletions } from '../types'
import { toDateTime, scheduledDate, toDate } from './datetime'

/**
 * Serializable configuration state for a set of task filters. To actually filter
 * tasks according to a filter config, pass the config into `generateTaskFilter`
 * to create a predicate function that operates on a single task.
 */
export type FilterConfig = {
  tagged?: TagID[]
  notTagged?: TagID[]

  type?: TaskType[] // types to include

  points?: [number?, number?] // min and max
  pointsRemaining?: [number?, number?]
  hasRunningPoints?: boolean

  priority?: [number?, number?] // min and max

  isScheduled?: boolean // scheduled OR deadline
  hasDeadline?: boolean // deadline only
  scheduledAt?: [DateTime?, DateTime?]

  isCompleted?: boolean
  lastCompletedAt?: [DateTime?, DateTime?] // each is nullable. "after, before"
}

// ------ utils ------

const isInRange = <T>(f: [T?, T?], x: T) =>
  (!f[0] || x >= f[0]) && (!f[1] || x <= f[1])

const isDateInRange = (f: [DateTime?, DateTime?], x: Date) =>
  (!f[0] || x >= toDate(f[0])) && (!f[1] || x <= toDate(f[1]))

// ------ filtering functions for each key in the config ------

type FilterFunction<K extends keyof FilterConfig> = (
  f: NonNullable<FilterConfig[K]>,
  task: TaskWithCompletions
) => boolean

const filterFunctions: { [K in keyof FilterConfig]: FilterFunction<K> } = {
  tagged: (f, task) => f.every(task.tagIds.includes),
  notTagged: (f, task) => !f.some(task.tagIds.includes),

  type: (f, task) => f.includes(task.settings.type),

  points: (f, task) =>
    (!f[0] || task.settings.points >= f[0]) &&
    (!f[1] || task.settings.points <= f[1]),
  pointsRemaining: (f, task) =>
    isInRange(f, task.settings.points - task.runningPoints ?? 0),
  hasRunningPoints: (f, task) => task.runningPoints > 0 === f,

  priority: (f, task) => isInRange(f, task.settings.priority),

  isScheduled: (f, task) =>
    (!!task.settings.scheduled || !!task.settings.deadline) === f,
  hasDeadline: (f, task) => !!task.settings.deadline === f,
  scheduledAt: (f, task) => isDateInRange(f, scheduledDate(task)),

  isCompleted: (f, task) => task.completions.some(c => c.isFull) === f,
  lastCompletedAt: (f, task) =>
    task.completions.some(c => isDateInRange(f, toDate(c.date))),
}

// necessary for types to work
const getFilterFunction = (key: keyof FilterConfig) =>
  filterFunctions[key] as FilterFunction<typeof key>

export const generateTaskFilter =
  (config: FilterConfig) => (task: TaskWithCompletions) =>
    reduce(
      config,
      (res, value, key) =>
        res &&
        (value === undefined ||
          getFilterFunction(key as keyof FilterConfig)(value, task)),
      true
    )

// -------- example filter configs -------------

export const defaultConfigs: { [k: string]: FilterConfig } = {
  activeRecurring: {
    type: ['recurring'],
    scheduledAt: [undefined, toDateTime(new Date())], // scheduled before now
  },
  todo: { type: ['once'], isCompleted: false },
  buckets: { type: ['bucket'] },
  inactiveRecurring: {
    type: ['recurring'],
    scheduledAt: [toDateTime(new Date()), undefined], // scheduled after now
  },
  completed: { type: ['once'], isCompleted: true },
  all: {},
}
