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

// --------- parsing / conversions ------------

/**
 * Parses a JS Date to either the date or time portion of a DateTime object,
 * depending on the first parameter.  Used in `toDateTime`.
 */
export const parseValue = (
  type: 'date' | 'time',
  date: Date
): DateTime[typeof type] =>
  type === 'date'
    ? [date.getFullYear(), date.getMonth(), date.getDate()]
    : [date.getHours(), date.getMinutes()]

/** Parses a JS Date to a DateTime object, optionally including the time. */
export const toDateTime = (date: Date, parseTime: boolean = false) =>
  ({
    date: parseValue('date', date),
    time: parseTime ? parseValue('time', date) : undefined,
  } as DateTime)

/** Creates a new DateTime from the current date. */
export const currentDateTime = (parseTime: boolean = false) =>
  toDateTime(new Date(), parseTime)

/**
 * Converts a DateTime to a JS Date.  If the DateTime lacks time data, we fill
 * it in with the "default time", currently hardcoded here.
 */
export const toDate = (dt: DateTime, defaultTime: [number, number] = [12, 0]) =>
  new Date(...dt.date, ...(dt.time ?? defaultTime))

// --------- manipulating DateTimes ------------

export const clampDateTime = (
  dt: DateTime,
  freq: Frequency = Frequency.DAY
) => {
  const fn = frequencyClampFunctions[freq]
  return fn(toDate(dt))
}

/**
 * Returns the "scheduled date" for a task.  Always returns a JS Date:
 * the scheduled date if the task is scheduled, the warning date if it has a
 * deadline, or the current date otherwise.
 */
export const scheduledDate = (task: Task) =>
  task.settings.scheduled
    ? toDate(task.settings.scheduled)
    : task.settings.deadline
    ? toDate(subInterval(task.settings.deadlineWarning, task.settings.deadline))
    : new Date(task.createdAt)

// ------------- formatting ------------------

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

/**
 * Takes in a diff string (eg '3w') and adds some text to indicate whether it's
 * in the past or the future. Used in `formatRelativeDate`.
 */
const formatDiff = (diff: string, isPast: boolean, style: DiffStyle = 'long') =>
  diffFormats[style][isPast ? 0 : 1].replace('*', diff)

/** Stringifies the date portion of a DateTime. */
export const formatDate = (dt: DateTime, style: DiffStyle = 'long') => {
  const date = toDate(dt)
  const now = new Date()
  return `${format(
    date,
    isSameYear(now, date) ? 'EEE M/d' : 'M/d/yy'
  )} (${formatRelativeDate(dt, style)})`
}

/**
 * Takes a DateTime, compares it to the current date, and returns a relative
 * date or diff string (eg, '3w ago').
 */
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

/**
 * Stringifies a DateTime as a date plus time (if applicable).
 * Also accepts numeric timestamps.
 */
export const printDate = (input: number | DateTime, style?: DiffStyle) => {
  const dt =
    typeof input === 'number' ? toDateTime(new Date(input), true) : input

  return formatDate(dt, style) + (dt.time ? ', ' + formatTime(dt) : '')
}

export const printRelativeDate = (date: number | DateTime) => {
  const dt = typeof date === 'number' ? toDateTime(new Date(date)) : date
  return formatRelativeDate(dt, 'short')
}
