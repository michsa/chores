import React from 'react'
import { Pressable, FlatList, View } from 'react-native'
import { useTheme } from '@emotion/react'

import { Card, Text, PrimaryText, Icon, Divider } from '../components'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { NavigationProps } from '../types'
import { shortPriorityLabel, priorityLabel } from '../utils'

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const tasks = useSelector(getOrderedTasks)
  const theme = useTheme()
  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('viewTask', { id: item.id })}>
          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <PrimaryText style={{ flex: 1 }}>
                {item.settings.name}
              </PrimaryText>
              <Divider />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="star" size={16} />
                  <Divider size="xs" />
                  <Text>{item.settings.points}</Text>
                </View>
                <Divider size="m" />
                {!!item.settings.priority && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="flag" size={16} />
                    <Divider size="xs" />
                    <Text>{priorityLabel(item.settings.priority)}</Text>
                  </View>
                )}
              </View>
            </View>
            <Divider size="l" />

            <Icon name="check-circle" color="accent" size={26} />
          </Card>
        </Pressable>
      )}
    />
  )
}

export default TaskList
