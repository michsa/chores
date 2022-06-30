import { add, sub } from 'date-fns'
import { Recurrence, DateTime } from '../types'
import { frequencyLabel } from './frequency'
import { toDate, toDateTime } from './datetime'
import { maybePlural } from './misc'

const recurrenceToDuration = (r: Recurrence) => ({
  [frequencyLabel(r.frequency) + 's']: r.interval,
})

export const addRecurrence = (r: Recurrence, date: DateTime) =>
  toDateTime(add(toDate(date), recurrenceToDuration(r)), !!date.time)

export const subRecurrence = (r: Recurrence, date: DateTime) =>
  toDateTime(sub(toDate(date), recurrenceToDuration(r)), !!date.time)

export const printRecurrence = (r: Recurrence) =>
  `${r.interval} ${maybePlural(frequencyLabel(r.frequency)!, r.interval)}`
