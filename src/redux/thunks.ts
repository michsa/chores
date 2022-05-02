import { find } from 'lodash'
import { actions as tasks } from './slices/tasks'
import { actions as tags } from './slices/tags'
import { TaskSettings, TaskSettingsInput, Tag } from '../types'
import { Dispatch, State, Thunk } from './store'

export const deleteTask = tasks.remove

const createTask =
  (settings: TaskSettings): Thunk =>
  dispatch => {
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

const upsertTagsByName =
  (names: string[]): Thunk<Tag[]> =>
  (dispatch, getState) => {
    const existingTags = names.map(name =>
      find(getState().tags.entities, { name })
    )

    const tagsToSave = existingTags.map(
      (t, i) =>
        t ?? { id: `tag-${new Date().valueOf()}-${names[i]}`, name: names[i] }
    )

    dispatch(tags.upsertMany(tagsToSave))
    return tagsToSave
  }

export const upsertTask =
  ({ tagNames, ...settingsInput }: TaskSettingsInput, id?: string): Thunk =>
  dispatch => {
    const taskTags = dispatch(upsertTagsByName(tagNames))
    console.log({ taskTags })
    const settings = { ...settingsInput, tags: taskTags.map(t => t.id) }
    dispatch(
      id ? tasks.update({ id, changes: { settings } }) : createTask(settings)
    )
    return id
  }
