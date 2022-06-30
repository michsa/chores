import {
  format,
  isSameYear,
  isSameWeek,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInDays,
} from 'date-fns'
import { Frequency, DateTime, Task } from '../types'
import { subRecurrence } from './recurrence'
import { frequencyClampFunctions } from './frequency'

export const formatValue = (
  type: 'date' | 'time',
  date: Date
): DateTime[typeof type] =>
  type === 'date'
    ? [date.getFullYear(), date.getMonth(), date.getDate()]
    : [date.getHours(), date.getMinutes()]

export const formatDate = (dt: DateTime) => {
  const date = toDate(dt)
  const now = new Date()
  if (isYesterday(date)) return 'yesterday'
  if (isToday(date)) return 'today'
  if (isTomorrow(date)) return 'tomorrow'
  const dayDiff = differenceInDays(date, now)
  if (dayDiff > -7 && dayDiff < 9) {
    if (isSameWeek(now, date, { weekStartsOn: 1 })) return format(date, 'EEEE')
    if (dayDiff < 0) return 'last ' + format(date, 'EEEE')
    return 'next ' + format(date, 'EEEE')
  }
  return format(date, isSameYear(now, date) ? 'EEEE, MMM d' : 'MMM d, yyyy')
}

export const formatTime = (dt: DateTime) =>
  dt.time ? format(toDate(dt), 'h:mm a') : undefined

export const toDateTime = (date: Date, parseTime: boolean = false) =>
  ({
    date: formatValue('date', date),
    time: parseTime ? formatValue('time', date) : undefined,
  } as DateTime)

export const toDate = (dt: DateTime, defaultTime: [number, number] = [12, 0]) =>
  new Date(...dt.date, ...(dt.time ?? defaultTime))

export const scheduledDate = (task: Task) =>
  task.settings.scheduled
    ? toDate(task.settings.scheduled)
    : task.settings.deadline
    ? toDate(
        subRecurrence(task.settings.deadlineWarning, task.settings.deadline)
      )
    : new Date(task.createdAt)

export const printDate = (date: number | DateTime) => {
  const dt = typeof date === 'number' ? toDateTime(new Date(date)) : date
  return formatDate(dt) + (dt.time ? ' at ' + formatTime(dt) : '')
}

export const clampDateTime = (
  dt: DateTime,
  freq: Frequency = Frequency.DAY
) => {
  const fn = frequencyClampFunctions[freq]
  return fn(toDate(dt))
}
