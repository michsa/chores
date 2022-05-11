import { getLuminance } from 'polished'
import { Theme } from './theme'
import { Frequency, Priority, Recurrence, DateTime, Task } from './types'
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
  return format(
    date,
    isSameYear(now, date) ? 'EEEE, MMM d' : 'EEE, MMM d, yyyy'
  )
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

export const scheduledDate = (task: Task) => {
  let result = task.settings.scheduled
    ? toDate(task.settings.scheduled)
    : task.settings.deadline
    ? toDate(
        subRecurrence(task.settings.deadlineWarning!, task.settings.deadline!)
      )
    : new Date(task.createdAt)
  console.log(`scheduledDate ${task.settings.name}`, result, new Date())
  return result
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
