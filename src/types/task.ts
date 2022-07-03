import { DateTime, Interval, TagID, Tag, CompletionID, Completion } from '.'

export type TaskID = string

export type Priority = -2 | -1 | 0 | 1 | 2
export type PriorityLabel = 'Highest' | 'High' | 'Standard' | 'Low' | 'Lowest'

type BaseTaskSettings = {
  name: string
  points: number
  priority: Priority
  description: string

  scheduled?: DateTime
  deadline?: DateTime
  deadlineWarning?: Interval // required on tasks with a deadline

  isRecurring?: boolean // deprecated, use `type` instead
  type: 'recurring' | 'one-time' | 'bucket'
  // required on recurring tasks and buckets. `interval` would be
  // a better name. determines the recurrence interval of the task
  // (if recurring)
  recurrence?: Interval

  parent?: TaskID
  children?: TaskID[]
}

// discriminated union types for different kinds of task settings. TS can use
// these with property checking to infer or validate other properties - eg, if
// a TaskSettings object has a `deadline`, it must also have `deadlineWarning`
// and cannot also have `scheduled`.

type ScheduledSettings = {
  scheduled: DateTime
  deadline?: undefined
  deadlineWarning?: undefined
}
interface DeadlineSettings {
  deadline: DateTime
  deadlineWarning: Interval
  scheduled?: undefined
}
interface UnscheduledSettings {
  scheduled?: undefined
  deadline?: undefined
  deadlineWarning?: undefined
}

interface RecurringSettings {
  isRecurring: true
  type: 'recurring'
  recurrence: Interval
}
interface OneTimeSettings {
  isRecurring: false
  type: 'once'
  recurrence?: undefined
}
interface BucketSettings {
  isRecurring: false
  type: 'bucket'
  // for bucket tasks, `points` and `recurrence` together indicate
  // the "size" of the bucket in points-per-interval
  recurrence: Interval
}

/** Recurring tasks can be scheduled or deadline */
export type RecurringTaskSettings = BaseTaskSettings &
  RecurringSettings &
  (ScheduledSettings | DeadlineSettings)

/** One-time tasks can be scheduled, deadline, or unscheduled */
export type OneTimeTaskSettings = BaseTaskSettings &
  OneTimeSettings &
  (ScheduledSettings | DeadlineSettings | UnscheduledSettings)

/** Bucket tasks are a special case of unscheduled tasks, since they don't have points */
export type BucketTaskSettings = BaseTaskSettings &
  BucketSettings &
  UnscheduledSettings

export type TaskSettings =
  | RecurringTaskSettings
  | OneTimeTaskSettings
  | BucketTaskSettings

// Additional types for different kinds of TaskSettings based on
// scheduled/deadline dates.
// These are all subsets of TaskSettings above.

/** Scheduled tasks can be either recurring or one-time */
export type ScheduledTaskSettings = BaseTaskSettings &
  ScheduledSettings &
  (RecurringSettings | OneTimeSettings)

/** Deadline tasks can be either recurring or one-time */
export type DeadlineTaskSettings = BaseTaskSettings &
  DeadlineSettings &
  (RecurringSettings | OneTimeSettings)

/** Unscheduled tasks cannot be recurring */
export type UnscheduledTaskSettings = BaseTaskSettings &
  UnscheduledSettings &
  OneTimeSettings

// we use default values for all task properties (eg, `name` is defaulted to an
// empty string, `priority` is defaulted to 0), so a blank input for a new task
// is still a valid TaskSettings object. in EditTask, we then validate the form
// before submission, to check for correctly-typed but empty inputs like 0 & ''.
export type TaskSettingsInput = TaskSettings & {
  tagNames: string[]
}

export type Task = {
  id: TaskID
  settings: TaskSettings
  createdAt: number
  tagIds: TagID[]
  completionIds: CompletionID[]
  runningPoints: number
}

export type TaskWithTags = Task & { tags: Tag[] }
export type TaskWithCompletions = Task & { completions: Completion[] }
export type TaskWithTagsAndCompletions = TaskWithTags & TaskWithCompletions
