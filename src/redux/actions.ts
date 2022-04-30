import { actions as tasks } from './slices/tasks'
import { TaskSettings, Task } from '../types'

export const deleteTask = tasks.remove

export const createTask = (t: TaskSettings) => {
  const createdAt = Date.now()
  return tasks.add({
    ...t,
    id: `t${createdAt}`,
    createdAt,
    completions: [],
  })
}

export const upsertTask = (t: Task | TaskSettings) =>
  'id' in t ? tasks.upsert(t) : createTask(t)
