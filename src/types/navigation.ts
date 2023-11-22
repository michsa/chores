import {
  CompositeScreenProps,
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native'
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { TaskID } from './task'
import { FilterID, Filter } from './filter'

// ----- stack params ------

export type RootStackParams = {
  root: undefined
  singleTaskView: { id: TaskID }
  editTask: { id: TaskID } | undefined
  completeTask: { id: TaskID }
}

export type DrawerParams = {
  multiTaskView: { filterId: FilterID }
  tags: undefined
  settings: undefined
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

// ----- screen props ------

export type ScreenProps = {
  root: StackScreenProps<RootStackParams, 'root'>

  // multi tasks
  multiTaskView: Compose<
    DrawerScreenProps<DrawerParams, 'multiTaskView'>,
    'root'
  >
  taskList: Compose<
    BottomTabScreenProps<MultiTaskViewParams, 'taskList'>,
    'multiTaskView'
  >
  multiTaskMetrics: Compose<
    BottomTabScreenProps<MultiTaskViewParams, 'multiTaskMetrics'>,
    'multiTaskView'
  >

  // single tasks
  singleTaskView: Compose<
    StackScreenProps<RootStackParams, 'singleTaskView'>,
    'root'
  >
  taskDetails: Compose<
    BottomTabScreenProps<SingleTaskViewParams, 'taskDetails'>,
    'singleTaskView'
  >
  singleTaskMetrics: Compose<
    BottomTabScreenProps<SingleTaskViewParams, 'singleTaskMetrics'>,
    'singleTaskView'
  >

  // other drawer screens
  about: Compose<DrawerScreenProps<DrawerParams, 'about'>, 'root'>

  // modals
  editTask: StackScreenProps<RootStackParams, 'editTask'>
  completeTask: StackScreenProps<RootStackParams, 'completeTask'>
}

export type NavigationProps = {
  root: StackNavigationProp<RootStackParams, 'root'>
}

// ------ utils -------

// type we can pass to CompositeScreenProps
type ComposableScreenProp = {
  navigation: NavigationProp<
    ParamListBase,
    string,
    string | undefined,
    any,
    any,
    any
  >
  route: RouteProp<ParamListBase>
}

type Compose<
  y extends ComposableScreenProp,
  x extends keyof ScreenProps
> = CompositeScreenProps<y, ScreenProps[x]>
