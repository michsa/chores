import { actions as tasks } from './slices/tasks'
import { Task } from '../types'
import { nanoid } from 'nanoid'

export const createTask = (t: Omit<Task, 'id'>) => tasks.add({ ...t, id: nanoid() })
