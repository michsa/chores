import { getLuminance } from 'polished'
import { Theme } from './theme'
import {
  Frequency,
  Priority,
  Recurrence,
  DateTime,
  Task,
  TaskWithCompletions,
} from './types'
import {
  add,
  sub,
  format,
  isSameYear,
  isSameWeek,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInDays,
  startOfDay,
  startOfHour,
  startOfWeek,
  startOfYear,
  startOfMonth,
} from 'date-fns'

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

export const readableText = (theme: Theme, color: keyof Theme['colors']) => {
  const lightText = theme.isDark ? 'primaryText' : 'headerBackground'
  const darkText = theme.isDark ? 'headerBackground' : 'primaryText'
  return getLuminance(theme.colors[color]) > 0.5 ? darkText : lightText
}

export const scheduledDate = (task: Task) =>
  task.settings.scheduled
    ? toDate(task.settings.scheduled)
    : task.settings.deadline
    ? toDate(
        subRecurrence(task.settings.deadlineWarning, task.settings.deadline)
      )
    : new Date(task.createdAt)

/**
 * function to generate a sigmoid curve. we use this to translate day offsets
 * (how many days between now and when a task is scheduled) into urgency
 * multipliers.
 *
 * a sigmoid curve is a horizontal s-shape; as _x_ approaches infinity, _y_
 * asymptotically approaches some upper or lower bound. this allows us to
 * constrain a potentially infinite range of day offsets into a bounded range
 * of multipliers (by default, between 2 and 0).
 *
 * https://www.desmos.com/calculator/rbtm8jtumi
 *
 * configuration params:
 *
 * - `b` - determines the inflection point along the _x_-axis (the value of _x_
 *      for which _y_ is equal to the midpoint between the two asymptotes).
 *
 * - `c` - controls the height of the curve. eg, if `c = 2` and `d = 0`, the
 *      upper bound of the curve will occur at 2 and the lower bound at 0.
 *      if `c` is negative, the curve is flipped about the _x_-axis.
 *
 * - `d` - _y_-offset of the curve.
 *
 * - `k` - controls the steepness and direction of the curve. when `k = 0` the
 *      curve is flat, and as it increases or decreases it becomes steeper.
 *      when `k` is positive, _y_ will approach `d` as _x_ increases and `c` as
 *      _x_ decreases (a Z-curve when `c` is positive); when `k` is negative,
 *      this is reversed.
 */
export const sigmoid = (
  x: number,
  {
    b = 0,
    c = 2,
    d = 0,
    k = 0.1,
  }: { [k in 'b' | 'c' | 'd' | 'k']?: number } = {}
) => c / (1 + Math.exp(k * x - b / 2)) + d

const priorityMultiplerMapping = {
  [-2]: 0.5,
  [-1]: 0.75,
  [0]: 1,
  [1]: 1.5,
  [2]: 2,
}

export const calcUrgency = (task: TaskWithCompletions) => {
  const date = scheduledDate(task)
  const dateOffset = differenceInDays(date, new Date())
  const dateOffsetMultipler = sigmoid(dateOffset)
  const priorityMultipler = priorityMultiplerMapping[task.settings.priority]
  const urgency = dateOffsetMultipler * priorityMultipler
  // return { urgency, dateOffset, dateOffsetMultipler, priorityMultipler }
  return urgency
}

export const printDate = (date: number | DateTime) => {
  const dt = typeof date === 'number' ? toDateTime(new Date(date)) : date
  return formatDate(dt) + (dt.time ? ' at ' + formatTime(dt) : '')
}

export const exists = <T>(x: T | undefined): x is T => !!x

export const maybePlural = (text: string, qty: number) =>
  qty === 1 ? text : `${text}s`

export const frequencies = {
  day: Frequency.DAY,
  week: Frequency.WEEK,
  month: Frequency.MONTH,
  year: Frequency.YEAR,
}

const frequencyLabels = {
  [Frequency.DAY]: 'day',
  [Frequency.WEEK]: 'week',
  [Frequency.MONTH]: 'month',
  [Frequency.YEAR]: 'year',
}
const frequencyClampFunctions = {
  [Frequency.DAY]: startOfDay,
  [Frequency.WEEK]: startOfWeek,
  [Frequency.MONTH]: startOfMonth,
  [Frequency.YEAR]: startOfYear,
}

export const clampDateTime = (
  dt: DateTime,
  freq: Frequency = Frequency.DAY
) => {
  const fn = frequencyClampFunctions[freq]
  return fn(toDate(dt))
}

const recurrenceToDuration = (r: Recurrence) => ({
  [frequencyLabels[r.frequency] + 's']: r.interval,
})

export const addRecurrence = (r: Recurrence, date: DateTime) =>
  toDateTime(add(toDate(date), recurrenceToDuration(r)), !!date.time)

export const subRecurrence = (r: Recurrence, date: DateTime) =>
  toDateTime(sub(toDate(date), recurrenceToDuration(r)), !!date.time)

export const frequencyOptions = [
  { label: 'day', value: Frequency.DAY },
  { label: 'week', value: Frequency.WEEK },
  { label: 'month', value: Frequency.MONTH },
  { label: 'year', value: Frequency.YEAR },
]

export const frequencyLabel = (f: Frequency) =>
  frequencyOptions.find(o => o.value === f)?.label

export const priorityOptions: { label: string; value: Priority }[] = [
  { label: 'Highest', value: 2 },
  { label: 'High', value: 1 },
  { label: 'Standard', value: 0 },
  { label: 'Low', value: -1 },
  { label: 'Lowest', value: -2 },
]

export const priorityLabel = (p: Priority) =>
  priorityOptions.find(o => o.value === p)?.label

export const printRecurrence = (r: Recurrence) =>
  `${r.interval} ${maybePlural(frequencyLabel(r.frequency)!, r.interval)}`

export const shortPriorityLabel = (p: Priority) =>
  `${p < 0 ? '−' : p > 0 ? '+' : ''}${Math.abs(p)}`
