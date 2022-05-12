import { range, sortBy } from 'lodash'
import {
  calcUrgency,
  sigmoid,
  toDateTime,
  printDate,
  priorityLabel,
} from '../src/utils'
import { TaskWithCompletions, Priority } from '../src/types'
import { add } from 'date-fns'

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
