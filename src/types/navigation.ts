import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { TaskID } from './task'
import { FilterID, Filter } from './filter'

export type RootStackParams = {
  root: undefined
  singleTaskView: { id: TaskID }
  editTask: { id: TaskID } | undefined
  completeTask: { id: TaskID }
}

export type DrawerParams = {
  multiTaskView: { filterId: FilterID }
  about: undefined
}

export type MultiTaskViewParams = {
  taskList: undefined
  multiTaskMetrics: undefined
}

export type SingleTaskViewParams = {
  taskDetails: undefined
  singleTaskMetrics: undefined
}

export type ScreenProps = {
  root: StackScreenProps<RootStackParams, 'root'>

  // multi tasks
  multiTaskView: DrawerScreenProps<DrawerParams, 'multiTaskView'>
  taskList: BottomTabScreenProps<MultiTaskViewParams, 'taskList'>
  multiTaskMetrics: BottomTabScreenProps<MultiTaskViewParams, 'multiTaskMetrics'>
  
  // single tasks
  singleTaskView: StackScreenProps<RootStackParams, 'singleTaskView'>
  taskDetails: BottomTabScreenProps<SingleTaskViewParams, 'taskDetails'>
  singleTaskMetrics: BottomTabScreenProps<SingleTaskViewParams, 'singleTaskMetrics'>

  // other drawer screens
  about: DrawerScreenProps<DrawerParams, 'about'>

  // modals
  editTask: StackScreenProps<RootStackParams, 'editTask'>
  completeTask: StackScreenProps<RootStackParams, 'completeTask'>
}

export type NavigationProps = {
  root: StackNavigationProp<RootStackParams, 'root'>
}
