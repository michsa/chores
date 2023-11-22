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
import CustomDrawer, { renderDrawerIcon } from './src/components/CustomDrawer'

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
                    // this function is needed for hot reloading to work
                    drawerContent={props => <CustomDrawer {...props} />}
                    screenOptions={{
                      headerTintColor: theme.colors.primaryText,
                      drawerLabelStyle: {
                        fontSize: theme.fontSizes.small,
                        // marginVertical: -theme.spacing.xxs
                      },
                    }}>
                    <Drawer.Screen
                      name="multiTaskView"
                      component={MultiTaskView}
                      initialParams={{ filterId: '_all' }}
                      options={{
                        title: 'Tasks',
                        drawerItemStyle: { display: 'none' },
                      }}
                    />
                    <Drawer.Screen
                      name="tags"
                      options={{
                        title: 'Tags',
                        drawerIcon: renderDrawerIcon('tag'),
                      }}>
                      {() => <React.Fragment />}
                    </Drawer.Screen>
                    {/* <Drawer.Screen
                      name="users"
                      options={{
                        title: 'Manage people',
                        drawerIcon: renderDrawerIcon('user'),
                      }}>
                      {() => <Text />}
                    </Drawer.Screen> */}
                    <Drawer.Screen
                      name="settings"
                      options={{
                        title: 'Settings',
                        drawerIcon: renderDrawerIcon('settings'),
                      }}>
                      {() => <React.Fragment />}
                    </Drawer.Screen>
                    {/* <Drawer.Screen
                      name="tools"
                      options={{
                        title: 'Tools',
                        drawerIcon: renderDrawerIcon('tool'),
                      }}>
                      {() => <Text />}
                    </Drawer.Screen> */}
                    <Drawer.Screen
                      name="about"
                      component={About}
                      options={{
                        title: 'About',
                        drawerIcon: renderDrawerIcon('info'),
                      }}
                    />
                  </Drawer.Navigator>
                )}
              </RootStack.Screen>
              <RootStack.Screen
                name="singleTaskView"
                component={SingleTaskView}
                options={{ title: 'View Task', detachPreviousScreen: false }}
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
