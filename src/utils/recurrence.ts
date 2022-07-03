import { add, sub } from 'date-fns'
import { Interval, DateTime } from '../types'
import { frequencyLabel } from './frequency'
import { toDate, toDateTime } from './datetime'
import { maybePlural } from './misc'

const intervalToDuration = (r: Interval) => ({
  [frequencyLabel(r.frequency) + 's']: r.count,
})

export const addInterval = (r: Interval, date: DateTime) =>
  toDateTime(add(toDate(date), intervalToDuration(r)), !!date.time)

export const subInterval = (r: Interval, date: DateTime) =>
  toDateTime(sub(toDate(date), intervalToDuration(r)), !!date.time)

export const printInterval = (r: Interval) =>
  `${r.count} ${maybePlural(frequencyLabel(r.frequency)!, r.count)}`
