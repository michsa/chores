import { actions as tasks } from './slices/tasks'
import { TaskSettings } from '../types'

export const createTask = (t: TaskSettings) => {
  const createdAt = new Date()
  return tasks.add({
    ...t,
    id: `t${createdAt.valueOf()}`,
    createdAt: new Date(),
    completions: [],
  })
}
