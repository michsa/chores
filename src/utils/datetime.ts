import {
  format,
  isSameYear,
  isSameWeek,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInDays,
  formatRelative,
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
} from 'date-fns'
import { Frequency, DateTime, Task } from '../types'
import { subRecurrence } from './recurrence'
import { frequencyClampFunctions } from './frequency'

export const parseValue = (
  type: 'date' | 'time',
  date: Date
): DateTime[typeof type] =>
  type === 'date'
    ? [date.getFullYear(), date.getMonth(), date.getDate()]
    : [date.getHours(), date.getMinutes()]

export const toDateTime = (date: Date, parseTime: boolean = false) =>
  ({
    date: parseValue('date', date),
    time: parseTime ? parseValue('time', date) : undefined,
  } as DateTime)

export const toDate = (dt: DateTime, defaultTime: [number, number] = [12, 0]) =>
  new Date(...dt.date, ...(dt.time ?? defaultTime))

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
  return format(date, isSameYear(now, date) ? 'EEE M/d' : 'M/d/yy')
}

const diffLabelMapping = [
  { fn: differenceInYears, label: 'y' },
  { fn: differenceInMonths, label: 'mo' },
  { fn: differenceInWeeks, label: 'w' },
  { fn: differenceInDays, label: 'd' },
]

const diffFormats = {
  long: ['* ago', 'in *'],
  short: ['-*', '+*'],
}
type DiffStyle = keyof typeof diffFormats

const formatDiff = (diff: string, isPast: boolean, style: DiffStyle = 'long') =>
  diffFormats[style][isPast ? 0 : 1].replace('*', diff)

export const formatRelativeDate = (dt: DateTime, style: DiffStyle = 'long') => {
  const date = toDate(dt)
  const now = new Date()

  for (let diff of diffLabelMapping) {
    const d = diff.fn(date, now)
    if (Math.abs(d) < 2 && diff.label !== 'd') continue

    const isPast = d < 0
    const diffString = Math.abs(d) + diff.label
    return formatDiff(diffString, isPast, style)
  }
}

export const formatTime = (dt: DateTime) =>
  dt.time ? format(toDate(dt), 'h:mm a') : undefined

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
  return (
    `${formatDate(dt)} (${formatRelativeDate(dt)})` +
    (dt.time ? ', ' + formatTime(dt) : '')
  )
}

export const printRelativeDate = (date: number | DateTime) => {
  const dt = typeof date === 'number' ? toDateTime(new Date(date)) : date
  return formatRelativeDate(dt, 'long')
}

export const clampDateTime = (
  dt: DateTime,
  freq: Frequency = Frequency.DAY
) => {
  const fn = frequencyClampFunctions[freq]
  return fn(toDate(dt))
}
