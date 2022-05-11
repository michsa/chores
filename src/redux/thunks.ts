import { find } from 'lodash'
import { actions as tasks } from './slices/tasks'
import { actions as tags } from './slices/tags'
import { actions as completions } from './slices/completions'
import {
  TaskSettings,
  TaskSettingsInput,
  Tag,
  Task,
  TaskID,
  TagID,
  CompletionInput,
  CompletionID,
} from '../types'
import { getTask } from './selectors'
import { Thunk } from './store'

export const deleteTask =
  (id: TaskID): Thunk =>
  (dispatch, getState) => {
    const task = getTask(getState(), id)
    if (!task) return
    dispatch(completions.removeMany(task.completionIds))
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
      runningPoints: 0,
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
    const taskId = dispatch(
      id ? updateTask(id, { settings, tagIds }) : createTask(settings, tagIds)
    )
    return taskId
  }

export const completeTask =
  (
    { nextDate, ...input }: CompletionInput,
    taskId: TaskID
  ): Thunk<CompletionID> =>
  dispatch => {
    const id = `c-${Date.now()}`
    const completion = { id, taskId, ...input }
    console.log({ input, completion })
    dispatch(completions.add(completion))
    dispatch(tasks.complete({ id: taskId, completion, nextDate }))
    return id
  }
