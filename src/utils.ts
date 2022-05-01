import { Frequency, Priority, Recurrence } from './types'

export const maybePlural = (text: string, qty: number) =>
  qty === 1 ? text : `${text}s`

export const frequencies = {
  day: Frequency.DAY,
  week: Frequency.WEEK,
  month: Frequency.MONTH,
  year: Frequency.YEAR,
}

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

export const shortPriorityLabel = (p: Priority) => `${p < 0 ? '−' : p > 0 ? '+' : ''}${Math.abs(p)}`