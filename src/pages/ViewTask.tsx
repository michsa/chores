import React, { useLayoutEffect } from 'react'
import { View, ScrollView } from 'react-native'

import { Text, PropertyText, Card, Divider, HeaderIcon } from '../components'
import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import { NavigationProps } from '../types'
import { priorityLabel, printRecurrence } from '../utils'

const ViewTask = ({
  navigation,
  route: {
    params: { id },
  },
}: NavigationProps['viewTask']) => {
  const dispatch = useDispatch()
  const task = useSelector(getTaskById(id))

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <HeaderIcon
            name="trash-2"
            color="danger"
            onPress={() => {
              dispatch(deleteTask(id))
              navigation.navigate('taskList')
            }}
          />
          <Divider />
          <HeaderIcon
            name="edit"
            onPress={() => navigation.navigate('editTask', { id })}
          />
        </View>
      ),
    })
  }, [navigation, task])

  if (!task) return null
  return (
    <ScrollView>
      <Card>
        <Text>Name</Text>
        <PropertyText style={{ fontSize: 20 }}>
          {task.settings.name}
        </PropertyText>
      </Card>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Card style={{ flex: 2, marginRight: 0 }}>
          <Text>Points</Text>
          <PropertyText>{task.settings.points}</PropertyText>
        </Card>
        <Divider />
        <Card style={{ flex: 3, marginLeft: 0 }}>
          <Text>Priority</Text>
          <PropertyText>{priorityLabel(task.settings.priority)}</PropertyText>
        </Card>
      </View>
      <Card>
        <Text>Tags</Text>
        <PropertyText>{task.settings.tags.join(' ')}</PropertyText>
      </Card>
      {!!task.settings.scheduled && (
        <Card>
          <Text>Scheduled</Text>
          <PropertyText>
            {new Date(task.settings.scheduled).toDateString()}
          </PropertyText>
        </Card>
      )}
      {!!task.settings.deadline && (
        <View style={{ flexDirection: 'row' }}>
          <Card style={{ flex: 3, marginRight: 0 }}>
            <Text>Deadline</Text>
            <PropertyText>
              {new Date(task.settings.deadline).toDateString()}
            </PropertyText>
          </Card>
          <Divider />
          {!!task.settings.deadlineWarning && (
            <Card style={{ flex: 2, marginLeft: 0 }}>
              <Text>Notify</Text>
              <PropertyText>
                {printRecurrence(task.settings.deadlineWarning)} before
              </PropertyText>
            </Card>
          )}
        </View>
      )}

      <Card>
        <Text>Notes</Text>
        <PropertyText>{task.settings.description}</PropertyText>
      </Card>
    </ScrollView>
  )
}

export default ViewTask
