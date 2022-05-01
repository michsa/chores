import React from 'react'
import { Pressable, FlatList } from 'react-native'

import { Card, Text } from '../components'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { NavigationProps } from '../types'

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const tasks = useSelector(getOrderedTasks)
  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('viewTask', { id: item.id })}>
          <Card style={{ flexDirection: 'row' }}>
            <Text>{item.settings.name}</Text>
            <Text>{JSON.stringify(item, null, 2)}</Text>
          </Card>
        </Pressable>
      )}
    />
  )
}

export default TaskList
