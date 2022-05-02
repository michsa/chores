import { actions as tasks } from './slices/tasks'
import { actions as tags } from './slices/tags'
import { TaskSettings, TaskSettingsInput } from '../types'
import { Dispatch } from './store'

export const deleteTask = tasks.remove

const createTask = (dispatch: Dispatch) => (settings: TaskSettings) => {
  const createdAt = Date.now()
  return dispatch(
    tasks.add({
      id: `t${createdAt}`,
      settings,
      createdAt,
      completions: [],
    })
  )
}

export const upsertTask =
  (dispatch: Dispatch) => (settings: TaskSettings, id?: string) => {
    return id
      ? dispatch(tasks.update({ id, changes: { settings } }))
      : createTask(dispatch)(settings)
  }
