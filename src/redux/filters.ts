import { Filter, FilterWithCompletions } from '../types'
import { scheduledDate } from '../utils'

export const composeFilters =
  <T>(filters: Filter<T>[]): Filter<T> =>
  task =>
    filters.every(filter => filter(task))

export const isBucket: Filter = task => !('points' in task.settings)

export const isRecurring: Filter = task => task.settings.isRecurring
export const hasBeenCompleted: FilterWithCompletions = task =>
  task.completions.some(c => c.isFull)
export const isFuture: Filter = task => scheduledDate(task) > new Date()

export const isCompleted: FilterWithCompletions = task =>
  !isRecurring(task) && !isBucket(task) && hasBeenCompleted(task)

export const isActive: FilterWithCompletions = task =>
  !isFuture(task) && !isCompleted(task)

export const isUpcoming: FilterWithCompletions = task =>
  isFuture(task) && !isCompleted(task)

export const isInProgress: Filter = task => !!task.runningPoints

// export default {
//   isRecurring: task => task.settings.isRecurring,
//   hasBeenCompleted: task => task.completions.some(c => c.isFull),
//   isFuture: task => scheduledDate(task) > new Date(),
//   isCompleted: task => !isRecurring(task) && hasBeenCompleted(task),
//   isActive: task => !isFuture(task) && !isCompleted(task),
//   isUpcoming: task => isFuture(task) && !isCompleted(task),
//   isInProgress: task => !!task.runningPoints,
// } as { [k: string]: Filter }
