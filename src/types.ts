import { StackScreenProps } from '@react-navigation/stack'

export type TaskStackParams = {
  taskList: undefined
  addTask: undefined
  editTask: { id: string }
  viewTask: { id: string }
}

export type NavigationProps = {
  taskList: StackScreenProps<TaskStackParams, 'taskList'>
  addTask: StackScreenProps<TaskStackParams, 'addTask'>
  editTask: StackScreenProps<TaskStackParams, 'editTask'>
  viewTask: StackScreenProps<TaskStackParams, 'viewTask'>
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

export type Tag = { id: string; name: string }

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
  tags: string[]
}

export type TaskSettingsInput = Omit<TaskSettings, 'tags'> & {
  tagNames: string[]
}

export type Task = {
  id: string
  settings: TaskSettings
  createdAt: number
  completions: Completion[]
}

export type Completion = {
  id: string
  name: string
  createdAt: number
  date: number
  points: number
  taskId: string
}
