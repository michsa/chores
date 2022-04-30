import React, { useLayoutEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import { dividerStyle, fieldStyle, propertyStyle } from '../styles'
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
          <Icon
            name="trash-can-outline"
            color="red"
            size={24}
            style={{ paddingHorizontal: 16 }}
            onPress={() => {
              dispatch(deleteTask(id))
              navigation.navigate('taskList')
            }}
          />
          <Icon
            name="pencil"
            size={24}
            style={{ paddingHorizontal: 16 }}
            onPress={() => navigation.navigate('editTask', { id })}
          />
        </View>
      ),
    })
  }, [navigation, task])

  if (!task) return null
  return (
    <ScrollView>
      <View style={fieldStyle}>
        <Text>Name</Text>
        <Text style={{ ...propertyStyle, fontSize: 20 }}>
          {task.settings.name}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ ...fieldStyle, flex: 2, marginRight: 0 }}>
          <Text>Points</Text>
          <Text style={propertyStyle}>{task.settings.points}</Text>
        </View>
        <View style={dividerStyle} />
        <View style={{ ...fieldStyle, flex: 3, marginLeft: 0 }}>
          <Text>Priority</Text>
          <Text style={propertyStyle}>
            {priorityLabel(task.settings.priority)}
          </Text>
        </View>
      </View>
      <View style={fieldStyle}>
        <Text>Tags</Text>
        <Text style={propertyStyle}>{task.settings.tags.join(' ')}</Text>
      </View>
      {!!task.settings.scheduled && (
        <View style={fieldStyle}>
          <Text>Scheduled</Text>
          <Text style={propertyStyle}>
            {new Date(task.settings.scheduled).toDateString()}
          </Text>
        </View>
      )}
      {!!task.settings.deadline && (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ ...fieldStyle, flex: 3, marginRight: 0 }}>
            <Text>Deadline</Text>
            <Text style={propertyStyle}>
              {new Date(task.settings.deadline).toDateString()}
            </Text>
          </View>
          <View style={dividerStyle} />
          {!!task.settings.deadlineWarning && (
            <View style={{ ...fieldStyle, flex: 2, marginLeft: 0 }}>
              <Text>Notify</Text>
              <Text style={propertyStyle}>
                {printRecurrence(task.settings.deadlineWarning)} before
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={fieldStyle}>
        <Text>Notes</Text>
        <Text style={propertyStyle}>{task.settings.description}</Text>
      </View>
    </ScrollView>
  )
}

export default ViewTask
