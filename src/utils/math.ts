import { differenceInDays } from 'date-fns'
import { TaskWithCompletions } from '../types'
import { scheduledDate } from './datetime'
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

export const calcUrgency = (task: TaskWithCompletions) => {
  const date = scheduledDate(task)
  const dateOffset = differenceInDays(date, new Date())
  const dateOffsetMultipler = sigmoid(dateOffset)
  const priorityMultipler = priorityMultiplerMapping[task.settings.priority]
  const urgency = dateOffsetMultipler * priorityMultipler
  // return { urgency, dateOffset, dateOffsetMultipler, priorityMultipler }
  return urgency
}
