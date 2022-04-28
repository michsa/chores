import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor } from './src/redux/store'
import EditTask from './src/components/EditTask'
import TaskList from './src/components/TaskList'

const TaskStack = createStackNavigator<TaskStackParams>()

type TaskStackParams = {
  taskList: undefined
  addTask: undefined
}

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
                <MaterialIcons
                  name="add-task"
                  size={24}
                  color="green"
                  style={{ paddingRight: 24, paddingLeft: 24 }}
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
        </TaskStack.Navigator>
      </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
