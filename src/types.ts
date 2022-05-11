import { StackScreenProps } from '@react-navigation/stack'

export type TaskStackParams = {
  taskList: undefined
  addTask: undefined
  editTask: { id: TaskID }
  viewTask: { id: TaskID }
  completeTask: { id: TaskID }
}

export type NavigationProps = {
  taskList: StackScreenProps<TaskStackParams, 'taskList'>
  addTask: StackScreenProps<TaskStackParams, 'addTask'>
  editTask: StackScreenProps<TaskStackParams, 'editTask'>
  viewTask: StackScreenProps<TaskStackParams, 'viewTask'>
  completeTask: StackScreenProps<TaskStackParams, 'completeTask'>
}

export enum Frequency {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export type Recurrence = {
  frequency: Frequency
  interval: number
}

export type Priority = -2 | -1 | 0 | 1 | 2

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

export type TagID = string
export type Tag = {
  id: TagID
  name: string
  // tasks: TaskID[]
}

export type TaskID = string
export type TaskSettings = {
  name: string
  points: number
  priority: Priority
  isRecurring: boolean
  recurrence?: Recurrence
  description: string
  scheduled?: DateTime
  deadline?: DateTime
  deadlineWarning?: Recurrence
}
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

export type CategoryID = string
export type Category = {
  id: CategoryID
  name: string
  completions: CompletionID[]
}

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
