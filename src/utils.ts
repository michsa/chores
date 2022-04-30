import { Frequency } from './types'

export const frequencies = {
  day: Frequency.DAY,
  week: Frequency.WEEK,
  month: Frequency.MONTH,
  year: Frequency.YEAR,
}

export const priorities = {
  Highest: 2,
  High: 1,
  Standard: 0,
  Low: -1,
  Lowest: -2,
}
