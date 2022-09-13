import {
  format,
  isSameYear,
  isSameWeek,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInDays,
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
} from 'date-fns'
import { Frequency, DateTime, Task } from '../types'
import { subInterval } from './interval'
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

export const formatDate = (dt: DateTime, style: DiffStyle = 'long') => {
  const date = toDate(dt)
  const now = new Date()
  // if (isYesterday(date)) return `yesterday (${format(date, 'M/d')})`
  // if (isToday(date)) return `today (${format(date, 'M/d')})`
  // if (isTomorrow(date)) return `tomorrow (${format(date, 'M/d')})`
  // const dayDiff = differenceInDays(date, now)
  // if (dayDiff > -7 && dayDiff < 9) {
  //   if (isSameWeek(now, date, { weekStartsOn: 1 })) return format(date, 'EEEE')
  //   if (dayDiff < 0) return 'last ' + format(date, 'EEEE')
  //   return 'next ' + format(date, 'EEEE')
  // }
  return `${format(
    date,
    isSameYear(now, date) ? 'EEE M/d' : 'M/d/yy'
  )} (${formatRelativeDate(dt, style)})`
}

const diffLabelMapping = [
  { fn: differenceInYears, label: 'y' },
  { fn: differenceInMonths, label: 'mo' },
  { fn: differenceInWeeks, label: 'w' },
  { fn: differenceInDays, label: 'd' },
]

const diffFormats = {
  long: ['* ago', 'in *'],
  short: ['*', '+*'],
}
type DiffStyle = keyof typeof diffFormats

const formatDiff = (diff: string, isPast: boolean, style: DiffStyle = 'long') =>
  diffFormats[style][isPast ? 0 : 1].replace('*', diff)

export const formatRelativeDate = (dt: DateTime, style: DiffStyle = 'long') => {
  const date = toDate(dt)
  const now = new Date()

  if (isYesterday(date)) return 'yesterday'
  if (isToday(date)) return 'today'
  if (isTomorrow(date)) return 'tomorrow'

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
    ? toDate(subInterval(task.settings.deadlineWarning, task.settings.deadline))
    : new Date(task.createdAt)

export const printDate = (input: number | DateTime, style?: DiffStyle) => {
  const dt =
    typeof input === 'number' ? toDateTime(new Date(input), true) : input

  const date = toDate(dt)

  return formatDate(dt, style) + (dt.time ? ', ' + formatTime(dt) : '')
}

export const printRelativeDate = (date: number | DateTime) => {
  const dt = typeof date === 'number' ? toDateTime(new Date(date)) : date
  return formatRelativeDate(dt, 'short')
}

export const clampDateTime = (
  dt: DateTime,
  freq: Frequency = Frequency.DAY
) => {
  const fn = frequencyClampFunctions[freq]
  return fn(toDate(dt))
}
