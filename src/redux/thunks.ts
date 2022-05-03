import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'
import { find } from 'lodash'
import { actions as tasks } from './slices/tasks'
import { actions as tags } from './slices/tags'
import {
  TaskSettings,
  TaskSettingsInput,
  Tag,
  Task,
  TaskID,
  TagID,
} from '../types'
import { Thunk } from './store'

export const deleteTask =
  (id: TaskID): Thunk =>
  dispatch => {
    // delete all the completions for the task
    // possibly remove task from tags index
    dispatch(tasks.remove(id))
  }

const updateTask =
  (id: TaskID, changes: Partial<Task>): Thunk<TaskID> =>
  dispatch => {
    dispatch(tasks.update({ id, changes }))
    return id
  }

const createTask =
  (settings: TaskSettings, tagIds: TagID[]): Thunk<TaskID> =>
  dispatch => {
    const createdAt = Date.now()
    const newTask = {
      id: `task-${createdAt}`,
      settings,
      tagIds,
      createdAt,
      completionIds: [],
    }
    dispatch(tasks.add(newTask))
    return newTask.id
  }

const upsertTagsByName =
  (names: string[]): Thunk<Tag[]> =>
  (dispatch, getState) => {
    const existingTags = names.map(name =>
      find(getState().tags.entities, { name })
    )
    const tagsToSave = existingTags.map(
      (t, i) => t ?? { id: `tag-${names[i]}-${Date.now()}`, name: names[i] }
    )
    dispatch(tags.upsertMany(tagsToSave))
    return tagsToSave
  }

export const upsertTask =
  ({ tagNames, ...settings }: TaskSettingsInput, id?: TaskID): Thunk<TaskID> =>
  dispatch => {
    const taskTags = dispatch(upsertTagsByName(tagNames))
    const tagIds = taskTags.map(t => t.id)
    const task = dispatch(
      id ? updateTask(id, { settings, tagIds }) : createTask(settings, tagIds)
    )
    return task
  }
