import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'

const TaskList = () => {
  const tasks = useSelector(getOrderedTasks)
  return (
    <View>
      {tasks.length ? (
        tasks.map(task => <Text>{task.name}</Text>)
      ) : (
        <Text>No tasks :(</Text>
      )}
    </View>
  )
}

export default TaskList
