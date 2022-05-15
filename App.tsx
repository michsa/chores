import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider as EThemeProvider } from '@emotion/react'

import IconButton from './src/components/IconButton'
import { store, persistor } from './src/redux/store'
import EditTask from './src/pages/EditTask'
import TaskList from './src/pages/TaskList'
import ViewTask from './src/pages/ViewTask'
import Completion from './src/pages/EditCompletion'
import Metrics from './src/pages/Metrics'
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
          <NavigationContainer
            theme={{
              dark: theme.isDark,
              colors: {
                primary: '#0f0',
                background: theme.colors.background,
                card: theme.colors.headerBackground,
                text: theme.colors.primaryText,
                border: theme.colors.highlight,
                notification: '#f00',
              },
            }}>
            <TaskStack.Navigator
              screenOptions={{
                headerStyle: { elevation: 0 },
                headerRightContainerStyle: { marginRight: theme.spacing.m },
              }}>
              <TaskStack.Screen
                name="taskList"
                component={TaskList}
                options={{ title: 'Tasks' }}
              />
              <TaskStack.Screen
                name="metrics"
                component={Metrics}
                options={{ title: 'Point totals' }}
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
              <TaskStack.Group screenOptions={{ presentation: 'modal' }}>
                <TaskStack.Screen
                  name="addTask"
                  component={EditTask}
                  options={{ title: 'Add Task' }}
                />
                <TaskStack.Screen
                  name="completeTask"
                  component={Completion}
                  options={{ title: 'Complete Task' }}
                />
              </TaskStack.Group>
            </TaskStack.Navigator>
          </NavigationContainer>
        </EThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
