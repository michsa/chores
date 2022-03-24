import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, Button, StyleProp, ViewStyle} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const TaskStack = createNativeStackNavigator<TaskStackParams>();

const centeredStyle: StyleProp<ViewStyle> = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const SummaryScreen = () => (
  <View style={centeredStyle}>
    <Text>SUMMARY</Text>
  </View>
);

const TaskListScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<TaskStackParams, 'taskList'>;
}) => (
  <View style={centeredStyle}>
    <Text>TASKS</Text>
    <Button onPress={() => navigation.navigate('addTask')} title="Add task" />
  </View>
);

const TaskDetailScreen = ({taskId}: {taskId: string}) => (
  <View style={centeredStyle}>
    <Text>Viewing task {taskId}</Text>
  </View>
);

const AddTaskScreen = () => (
  <View style={centeredStyle}>
    <Text>ADD TASK</Text>
  </View>
);

type TaskStackParams = {
  taskList: undefined;
  addTask: undefined;
};
const TasksScreen = () => {
  return (
    <TaskStack.Navigator>
      <TaskStack.Screen
        name="taskList"
        component={TaskListScreen}
        options={{
          title: 'Tasks',
          headerLeft: props => (
            <Text style={{marginLeft: -4, marginRight: 24}}>
              <DrawerToggleButton {...props} />
            </Text>
          ),
          headerBackVisible: false,
        }}
      />
      <TaskStack.Screen
        name="addTask"
        component={AddTaskScreen}
        options={{title: 'Add Task'}}
      />
    </TaskStack.Navigator>
  );
};

const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props}>
    <DrawerItem
      label="Tasks"
      icon={({color, size}) => (
        <FontAwesome5 name="tasks" color={color} size={size} />
      )}
      onPress={() => props.navigation.navigate('taskList')}
    />
    <DrawerItem 
    label="Add task"
    icon={({color, size}) => <MaterialIcons name="add-task" {...{color, size }} />}
    onPress={() => props.navigation.navigate('addTask')}/>
    <DrawerItem
      label="Metrics"
      icon={({color, size}) => (
        <Octicons name="graph" color={color} size={size} />
      )}
      onPress={() => props.navigation.navigate('metrics')}
    />
  </DrawerContentScrollView>
);

const Root = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="tasks"
      component={TasksScreen}
      options={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({color, size}) => (
          <FontAwesome5 name="tasks" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="metrics"
      component={SummaryScreen}
      options={{
        tabBarShowLabel: false,
        title: "Metrics",
        tabBarIcon: ({color, size}) => (
          <Octicons name="graph" color={color} size={size} />
        ),
        headerLeft: props => (
            <DrawerToggleButton {...props} />
        )
      }}
    />
  </Tab.Navigator>
);

const SettingsScreen = () => (
  <View style={centeredStyle}>
    <Text>SETTINGS</Text>
  </View>
);

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="drawer"
          component={Root}
          options={{headerShown: false}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
