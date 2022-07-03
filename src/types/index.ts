import { Task, TaskID, TaskWithCompletions } from './task'
export * from './navigation'
export * from './task'

/* -- COMMON TYPES -- */

export enum Frequency {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}
export type FrequencyLabel = 'day' | 'week' | 'month' | 'year'

export type Interval = {
  frequency: Frequency
  count: number
}

/**
 * used for user-defined dates. date and time are separate because time is
 * optional - when we convert this to a timestamp for date math, we use a
 * default time (hardcoded for now, but hopefully someday configurable in app
 * settings).
 *
 * these values are timezone-agnostic since they should always be interpreted
 * in local time. however, it seems our implementation of Date parses strings
 * without zone data as being in UTC rather than local time (eg, `...T05:00`
 * is interpreted as `...T05:00Z`). constructing a date from numeric args works
 * as expected though, so we use arrays of numbers for date and time instead of
 * strings.
 */
export type DateTime = {
  date: [number, number, number] // year, month, day
  time?: [number, number] // hour, minute
}

/* -- FILTERS -- */

export type Filter<T = Task> = (t: T) => boolean
export type FilterWithCompletions = Filter<TaskWithCompletions>

/* -- TAGS -- */

export type TagID = string
export type Tag = {
  id: TagID
  name: string
  // tasks: TaskID[]
}

/* -- CATEGORIES -- */

export type CategoryID = string
export type Category = {
  id: CategoryID
  name: string
  completions: CompletionID[]
}

/* -- COMPLETIONS -- */

export type CompletionID = string
export type CompletionInput = {
  date: DateTime
  points: number
  isFull: boolean
  nextDate?: DateTime
  notes?: string
  // category: CategoryID
}

export type Completion = {
  id: CompletionID
  taskId: TaskID
} & Omit<CompletionInput, 'nextDate'>
export type CompletionWithTask = Completion & { task: Task }
