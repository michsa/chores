import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/Feather'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider as EThemeProvider } from '@emotion/react'

import { store, persistor } from './src/redux/store'
import EditTask from './src/pages/EditTask'
import TaskList from './src/pages/TaskList'
import ViewTask from './src/pages/ViewTask'
import { darkTheme, lightTheme } from './src/theme'

import { TaskStackParams } from './src/types'

const TaskStack = createStackNavigator<TaskStackParams>()

const theme = darkTheme

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <EThemeProvider theme={theme}>
          <StatusBar
            backgroundColor={theme.colors.background}
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          />
          <NavigationContainer>
            <TaskStack.Navigator
              screenOptions={{
                headerTintColor: theme.colors.primaryText,
                headerStyle: {
                  backgroundColor: theme.colors.headerBackground,
                  elevation: 0,
                },
                cardStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}>
              <TaskStack.Screen
                name="taskList"
                component={TaskList}
                options={({ navigation }) => ({
                  title: 'Tasks',
                  headerRight: () => (
                    <Icon
                      name="plus-square"
                      size={26}
                      color="teal"
                      style={{ padding: 8, marginRight: 12 }}
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
                options={{ title: 'Edit Task', presentation: 'modal' }}
              />
              <TaskStack.Screen
                name="viewTask"
                component={ViewTask}
                options={{ title: 'View Task' }}
              />
            </TaskStack.Navigator>
          </NavigationContainer>
        </EThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
