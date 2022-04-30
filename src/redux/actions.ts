import { actions as tasks } from './slices/tasks'
import { TaskSettings, Task } from '../types'

export const deleteTask = tasks.remove

const createTask = (settings: TaskSettings) => {
  const createdAt = Date.now()
  return tasks.add({
    id: `t${createdAt}`,
    settings,
    createdAt,
    completions: [],
  })
}

export const upsertTask = (settings: TaskSettings, id?: string) =>
  id ? tasks.update({ id, changes: { settings } }) : createTask(settings)
