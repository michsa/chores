import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'
import { TaskID } from './task'

export type TaskStackParams = {
  metrics: undefined
  taskList: undefined
  editTask: { id: TaskID } | undefined
  viewTask: { id: TaskID }
  completeTask: { id: TaskID }
}

export type ScreenProps = {
  taskList: StackScreenProps<TaskStackParams, 'taskList'>
  editTask: StackScreenProps<TaskStackParams, 'editTask'>
  viewTask: StackScreenProps<TaskStackParams, 'viewTask'>
  completeTask: StackScreenProps<TaskStackParams, 'completeTask'>
}

export type NavigationProps = {
  taskList: StackNavigationProp<TaskStackParams, 'taskList'>
}
