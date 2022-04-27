
enum Frequency {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

type Recurrence = {
  frequency: Frequency
  interval: number
}

type Tag = string

export type TaskSettings = {
  name: string
  icon: string // emoji
  points: number
  priority: number
  isRecurring: boolean
  recurrence?: Recurrence
  description: string
  scheduled?: Date
  deadline?: Date
  deadlineWarning?: Recurrence
  tags: Tag[]
}

export type Task = TaskSettings & {
  id: string
  createdAt: Date
  completions: Completion[]
}

export type Completion = {
  id: string
  name: string
  createdAt: Date
  date: Date
  points: number
  taskId: string
}
