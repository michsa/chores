import { curry } from 'lodash'
import {
  add,
  sub,
  differenceInDays,
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
} from 'date-fns'
import { Interval, DateTime, Frequency, FrequencyLabel } from '../types'
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

export const printInterval = (
  r: Interval,
  style: 'short' | 'long' = 'long',
  alwaysShowCount: boolean = true
) =>
  (alwaysShowCount || r.count > 1 ? r.count : '') +
  (style === 'short'
    ? frequencyLabel(r.frequency, 'short')
    : ' ' + maybePlural(frequencyLabel(r.frequency)!, r.count))

const frequencyDiffFnMapping: { [k in Frequency]: Function } = {
  [Frequency.DAY]: differenceInDays,
  [Frequency.WEEK]: differenceInWeeks,
  [Frequency.MONTH]: differenceInMonths,
  [Frequency.YEAR]: differenceInYears,
}

const differenceIn = (f: Frequency, a: Date, b: Date) =>
  frequencyDiffFnMapping[f](a, b)

export const differenceInIntervals = (i: Interval, start: Date, end: Date) => {
  return differenceIn(i.frequency ?? 1, start, end) / (i.count || 1)
}
