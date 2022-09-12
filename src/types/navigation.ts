import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'
import { TaskID } from './task'

export type TaskStackParams = {
  metrics: undefined
  taskList: undefined
  addTask: undefined
  editTask: { id: TaskID }
  viewTask: { id: TaskID }
  completeTask: { id: TaskID }
}

export type ScreenProps = {
  taskList: StackScreenProps<TaskStackParams, 'taskList'>
  addTask: StackScreenProps<TaskStackParams, 'addTask'>
  editTask: StackScreenProps<TaskStackParams, 'editTask'>
  viewTask: StackScreenProps<TaskStackParams, 'viewTask'>
  completeTask: StackScreenProps<TaskStackParams, 'completeTask'>
}

export type NavigationProps = {
  taskList: StackNavigationProp<TaskStackParams, 'taskList'>
}
