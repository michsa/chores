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

export type TagID = string
export type Tag = { id: TagID; name: string; tasks: TaskID[] }

export type TaskID = string
export type TaskSettings = {
  name: string
  points: number
  priority: Priority
  isRecurring: boolean
  recurrence?: Recurrence
  description: string
  scheduled?: number
  deadline?: number
  deadlineWarning?: Recurrence
}
export type TaskSettingsInput = Omit<TaskSettings, 'points'> & {
  points?: number
  tagNames: string[]
}

export type Task = {
  id: TaskID
  settings: TaskSettings
  createdAt: number
  tagIds: TagID[]
  completionIds: CompletionID[]
}

export type TaskWithTags = Task & { tags: Tag[] }
export type TaskWithCompletions = Task & { completions: Completion[] }

export type CategoryID = string
export type Category = {
  id: CategoryID
  name: string
  completions: CompletionID[]
}

export type CompletionID = string
export type CompletionSettings = {
  date: number
  points: number
  isPartial: boolean
  category: CategoryID
}

export type Completion = {
  id: CompletionID
  taskId: TaskID
  settings: CompletionSettings
}
