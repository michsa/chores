import React from 'react'
import { View, Pressable, Text, FlatList } from 'react-native'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { NavigationProps } from '../types'
import { fieldStyle } from '../styles'

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const tasks = useSelector(getOrderedTasks)
  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('viewTask', { id: item.id })}>
          <View style={{ ...fieldStyle, flexDirection: 'row' }}>
            <Text>{item.settings.name}</Text>
            <Text>{JSON.stringify(item, null, 2)}</Text>
          </View>
        </Pressable>
      )}
    />
  )
}

export default TaskList
