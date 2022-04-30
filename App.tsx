import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor } from './src/redux/store'
import EditTask from './src/components/EditTask'
import TaskList from './src/components/TaskList'
import ViewTask from './src/components/ViewTask'
import {TaskStackParams } from './src/types'

const TaskStack = createStackNavigator<TaskStackParams>()

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <TaskStack.Navigator>
          <TaskStack.Screen
            name="taskList"
            component={TaskList}
            options={({ navigation }) => ({
              title: 'Tasks',
              headerRight: () => (
                <Icon
                  name="pencil-plus"
                  size={24}
                  style={{ paddingHorizontal: 16 }}
                  onPress={() => navigation.navigate('addTask')}
                />
              ),
            })}
          />
          <TaskStack.Screen
            name="addTask"
            component={EditTask}
            options={{ title: 'Add Task', presentation: 'modal' }}
          />
          <TaskStack.Screen
            name="editTask"
            component={EditTask}
            options={{ title: 'Edit Task' }}
          />
          <TaskStack.Screen
            name="viewTask"
            component={ViewTask}
            options={{ title: 'View Task' }}
          />
        </TaskStack.Navigator>
      </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
