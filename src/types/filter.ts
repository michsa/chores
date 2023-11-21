import { TagID, DateTime } from '.'
import { Task, TaskType } from './task'

export type FilterID = string

/**
 * Serializable filter state which can be be used to produce a TaskFilter
 * function that takes in a task and returns a boolean. Contains one or more
 * FilterConfigs which are or'd together.
 */
export type Filter = {
  name: string
  id: string
  configs: FilterConfig[]
}

/**
 * A generic filter that operates on a task and returns a boolean.
 * Used as a component of FilterConfigs, or in code.
 */
export type TaskFilter<T extends Task = Task> = (task: T) => boolean

/* -- FILTERS -- */

// export type Filter<T = Task> = (t: T) => boolean
// export type FilterWithCompletions = Filter<TaskWithCompletions>

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
  pointsRemaining?: [number?, number?] // min and max
  hasRunningPoints?: boolean

  priority?: [number?, number?] // min and max

  isScheduled?: boolean // scheduled OR deadline
  hasDeadline?: boolean // deadline only
  scheduledAt?: [DateTime?, DateTime?]

  isCompleted?: boolean // true if the task is a completed one-off
  lastCompletedAt?: [DateTime?, DateTime?] // each is nullable. "after, before"
}
