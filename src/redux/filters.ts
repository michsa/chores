import { Filter, FilterWithCompletions } from '../types'
import { scheduledDate } from '../utils'

export const composeFilters =
  <T>(filters: Filter<T>[]): Filter<T> =>
  task =>
    filters.every(filter => filter(task))

export const isBucket: Filter = task => task.settings.type === 'bucket'
export const isRecurring: Filter = task => task.settings.type === 'recurring'
export const isOnce: Filter = task => task.settings.type === 'once'

export const hasBeenCompleted: FilterWithCompletions = task =>
  task.completions.some(c => c.isFull)

export const isFuture: Filter = task => scheduledDate(task) > new Date()

export const isCompleted: FilterWithCompletions = task =>
  isOnce(task) && hasBeenCompleted(task)

export const isActive: FilterWithCompletions = task =>
  !isFuture(task) && !isCompleted(task)

export const isUpcoming: FilterWithCompletions = task =>
  isFuture(task) && !isCompleted(task)

export const isInProgress: Filter = task => !!task.runningPoints
