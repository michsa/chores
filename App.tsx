import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider as EThemeProvider } from '@emotion/react'

import { store, persistor } from './src/redux/store'
import EditTask from './src/pages/EditTask'
import MultiTaskView from './src/pages/MultiTaskView'
import SingleTaskView from './src/pages/SingleTaskView'
import Completion from './src/pages/EditCompletion'
import About from './src/pages/About'
import { darkTheme, lightTheme } from './src/theme'
import DrawerFilters from './src/components/DrawerFilters'

import { RootStackParams, DrawerParams } from './src/types'

const RootStack = createStackNavigator<RootStackParams>()
const Drawer = createDrawerNavigator<DrawerParams>()

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
                primary: theme.colors.accent,
                background: theme.colors.background,
                card: theme.colors.headerBackground,
                text: theme.colors.primaryText,
                border: theme.colors.highlight,
                notification: '#f00',
              },
            }}>
            <RootStack.Navigator
              screenOptions={{
                headerStyle: { elevation: 0 },
                headerRightContainerStyle: { marginRight: theme.spacing.m },
              }}>
              <RootStack.Screen name="root" options={{ headerShown: false }}>
                {() => (
                  <Drawer.Navigator
                  drawerContent={DrawerFilters}
                    screenOptions={{
                      headerTintColor: theme.colors.primaryText,
                    }}>
                    <Drawer.Screen
                      name="multiTaskView"
                      component={MultiTaskView}
                      initialParams={{ filterId: '_all' }}
                      options={{ title: 'Tasks', drawerItemStyle: { 'display': 'none' } }}
                    />
                    <Drawer.Screen name="about" component={About} />
                  </Drawer.Navigator>
                )}
              </RootStack.Screen>
              <RootStack.Screen
                name="singleTaskView"
                component={SingleTaskView}
                options={{ title: 'View Task' }}
              />
              <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                <RootStack.Screen
                  name="editTask"
                  component={EditTask}
                  options={({ route }) => ({
                    title: `${route.params?.id ? 'Edit' : 'Add'} Task`,
                  })}
                />
                <RootStack.Screen
                  name="completeTask"
                  component={Completion}
                  options={{ title: 'Complete Task' }}
                />
              </RootStack.Group>
            </RootStack.Navigator>
          </NavigationContainer>
        </EThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
