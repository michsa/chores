import { Frequency, FrequencyLabel } from '../types'
import { startOfDay, startOfWeek, startOfYear, startOfMonth } from 'date-fns'

export const frequencyClampFunctions: {
  [k in Frequency]: (fn: Date | number) => Date
} = {
  [Frequency.DAY]: startOfDay,
  [Frequency.WEEK]: startOfWeek,
  [Frequency.MONTH]: startOfMonth,
  [Frequency.YEAR]: startOfYear,
}

export const frequencyOptions: { label: FrequencyLabel; value: Frequency }[] = [
  { label: 'day', value: Frequency.DAY },
  { label: 'week', value: Frequency.WEEK },
  { label: 'month', value: Frequency.MONTH },
  { label: 'year', value: Frequency.YEAR },
]
const frequencyLabels = frequencyOptions.reduce((labels, option) => {
  labels[option.value] = option.label
  return labels
}, {} as { [k in Frequency]: FrequencyLabel })

const shortFrequencyLabels = {
  [Frequency.DAY]: 'd',
  [Frequency.WEEK]: 'w',
  [Frequency.MONTH]: 'mo',
  [Frequency.YEAR]: 'y',
}

export const frequencyLabel = (
  f: Frequency,
  style: 'long' | 'short' = 'long'
) => (style === 'long' ? frequencyLabels[f] : shortFrequencyLabels[f])
