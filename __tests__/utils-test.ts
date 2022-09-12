import { range, sortBy } from 'lodash'
import {
  calcUrgency,
  sigmoid,
  toDateTime,
  printDate,
  priorityLabel,
  differenceInIntervals,
  toDate,
} from '../src/utils'
import {
  TaskWithCompletions,
  Priority,
  Frequency,
  Interval,
} from '../src/types'
import { add, Duration } from 'date-fns'

describe('math', () => {
  it('sigmoid', () => {
    const dateOffsets = range(-30, 31)
    console.table(dateOffsets.map(d => ({ x: d, y: sigmoid(d) })))
  })

  it('calcUrgency', () => {
    const dateOffsets = range(-15, 1)
    const priorities = range(-2, 3) as Priority[]
    const tasks = priorities.flatMap(priority =>
      dateOffsets.map(days => ({
        settings: {
          scheduled: toDateTime(add(new Date(), { days })),
          priority,
        },
        dateOffset: days,
      }))
    )

    const tasksWithUrgency = tasks.map(task => ({
      ...task,
      urgency: calcUrgency(task as unknown as TaskWithCompletions),
    }))
    console.table(
      sortBy(tasksWithUrgency, t => -t.urgency).map(t => ({
        urgency: t.urgency,
        priority: priorityLabel(t.settings.priority),
        dateOffset: t.dateOffset,
        date: printDate(t.settings.scheduled),
      }))
    )
  })
})

describe.only('intervals', () => {
  describe('differenceInIntervals', () => {
    const test = (diff: Duration, interval: Interval, expected: number) => {
      const a = new Date()
      const b = add(a, diff)
      expect(differenceInIntervals(interval, a, b)).toEqual(expected)
    }

    it('works for dates less than one interval apart', () => {
      test({ days: 2 }, { frequency: Frequency.WEEK, count: 1 }, -0)
    })

    it('works for dates exactly one interval apart', () => {
      test({ weeks: 2 }, { frequency: Frequency.WEEK, count: 2 }, -1)
    })

    it('works for dates more than one interval apart', () => {
      test({ weeks: 3 }, { frequency: Frequency.WEEK, count: 2 }, -1.5)
    })

    it('works with an actual use case', () => {
      const now = new Date()
      const scheduled = toDate({ date: [2022, 7, 8] })
      const interval = { frequency: Frequency.DAY, count: 3 }
      console.log(differenceInIntervals(interval, now, scheduled))
    })
  })
})
