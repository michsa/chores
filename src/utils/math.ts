import { differenceInDays } from 'date-fns'
import { maxBy } from 'lodash'
import { TaskWithCompletions } from '../types'
import { scheduledDate, toDate } from './datetime'
import { differenceInIntervals } from './interval'
import { priorityMultiplerMapping } from './priority'

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

/**
 * Formula to calculate the urgency of a task, for intelligent sorting.
 * This is calculated differently for different kinds of tasks.
 *
 * - For buckets, urgency depends on how many points were actually completed
 *   within the last interval compared to the target.
 *
 * - For recurring tasks, we will always have a scheduled date and an interval,
 *   so we can scale urgency with the number of intervals since that date.
 *
 * - One-off tasks may or may not have a scheduled date. For those that do,
 *   urgency should scale with time since the scheduled date, but we can't
 *   count in intervals so we need to use a gentler curve based on total days.
 *
 *   One-off tasks may not be scheduled either, in which case we need to use
 *   the task's creation date, with an even gentler curve.
 *
 * The time-based urgency value derived from the above is then multipled by a
 * priority multiplier for the final result.
 */
export const calcUrgency = (task: TaskWithCompletions) => {
  const date = scheduledDate(task)

  let baseUrgency = 1
  if (task.settings.type === 'recurring') {
    const intervalOffset = differenceInIntervals(
      task.settings.interval,
      date,
      new Date()
    )
    baseUrgency = sigmoid(intervalOffset, { k: 0.11 })
  }

  if (task.settings.type === 'bucket') {
    const pointsInLastInterval = task.completions.reduce((points, c) => {
      const cDate = toDate(c.date)
      const diff = differenceInIntervals(
        task.settings.interval!,
        new Date(),
        cDate
      )
      const isWithinLastInterval = diff < 1
      console.log({ cDate, diff, isWithinLastInterval })
      return points + (isWithinLastInterval ? c.points : 0)
    }, 0)

    const pointsRemaining = task.settings.points - pointsInLastInterval
    const percentRemaining = pointsRemaining / task.settings.points
    baseUrgency = 1 + percentRemaining

    console.log({ pointsInLastInterval, baseUrgency })
  }

  if (task.settings.type === 'once') {
    const dateOffset = differenceInDays(date, new Date())
    baseUrgency = sigmoid(dateOffset, { k: 0.05 }) // 1.5 at ~21 days, 1.9 at ~60 days
  }

  const priorityMultipler = priorityMultiplerMapping[task.settings.priority]

  const urgency = baseUrgency * priorityMultipler
  // return { urgency, dateOffset, dateOffsetMultipler, priorityMultipler }
  return urgency
}
