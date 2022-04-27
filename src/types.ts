
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

export type TaskID = string
type Tag = string

export type Task = {
  id: TaskID
  name: string
  description: string
  icon: string // emoji
  createdAt: Date
  isRecurring: boolean
  recurrence: Recurrence
  deadline: Date
  deadlineWarning?: Recurrence
  scheduled: Date
  points: number
  tags: Tag[]
  priority: number
}

export type CompletionID = string

export type Completion = {
  id: CompletionID
  name: string
  createdAt: Date
  date: Date
  points: number
  taskId: TaskID
}