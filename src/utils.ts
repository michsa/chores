import { getLuminance } from 'polished'
import { Theme } from './theme'
import { Frequency, Priority, Recurrence, DateTime } from './types'
import { add, sub, formatRelative, format } from 'date-fns'

// export const toDate = (dt: DateTime, defaultTime: string = '12:00') => {
//   const date = new Date(`${dt.date}T${dt.time ?? defaultTime}`)
//   console.log('toDate', date.toISOString())
//   return date
// }

export const formatValue = (
  type: 'date' | 'time',
  date: Date
): DateTime[typeof type] =>
  type === 'date'
    ? [date.getFullYear(), date.getMonth(), date.getDate()]
    : [date.getHours(), date.getMinutes()]

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

export const printDate = (date: number) => formatRelative(date, new Date())

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

export const addRecurrence = (r: Recurrence, date: number) =>
  add(new Date(date), recurrenceToDuration(r)).valueOf()

export const subRecurrence = (r: Recurrence, date: number) =>
  sub(new Date(date), recurrenceToDuration(r)).valueOf()

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
