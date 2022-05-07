import React, { useLayoutEffect } from 'react'
import { Pressable, FlatList, View } from 'react-native'
import { useTheme } from '@emotion/react'

import {
  Card,
  Text,
  Icon,
  IconButton,
  Spacer,
  Row,
  Button,
} from '../components'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { NavigationProps } from '../types'
import { priorityLabel } from '../utils'

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const tasks = useSelector(getOrderedTasks)
  const theme = useTheme()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Row spacing="l">
          <IconButton name="filter" color="text" onPress={() => {}} />
          <IconButton
            variant="primary"
            size="xlarge"
            name="plus"
            onPress={() => navigation.navigate('addTask')}
          />
        </Row>
      ),
    })
  }, [navigation])

  const DetailSection = ({ icon, text }: { icon: string; text: any }) => (
    <Row spacing="xs">
      <Icon name={icon} size="small" />
      <Text>{text}</Text>
    </Row>
  )

  return (
    <React.Fragment>
      <FlatList
        style={{ margin: theme.spacing.s }}
        data={tasks}
        ItemSeparatorComponent={Spacer}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('viewTask', { id: item.id })}>
            <Row as={Card} style={{ paddingRight: theme.spacing.m }}>
              <View style={{ flex: 1 }}>
                <Text variant="primary" style={{ flex: 1 }}>
                  {item.settings.name}
                </Text>
                <Spacer />
                <Row spacing="m">
                  <DetailSection icon="star" text={item.settings.points} />
                  {!!item.settings.scheduled && (
                    <DetailSection
                      icon="calendar"
                      text={new Date(item.settings.scheduled).toDateString()}
                    />
                  )}
                  {!!item.settings.deadline && (
                    <DetailSection
                      icon="alert-circle"
                      text={new Date(item.settings.deadline).toDateString()}
                    />
                  )}
                  {!!item.settings.priority && (
                    <DetailSection
                      icon="flag"
                      text={priorityLabel(item.settings.priority)}
                    />
                  )}
                </Row>
              </View>
              <IconButton name="check-circle" color="accent" size="xlarge" />
            </Row>
          </Pressable>
        )}
      />
      {/* <Button
        variant="outline"
        icon="plus-circle"
        title="Add task"
        style={{ margin: theme.spacing.s }}
        onPress={() => navigation.navigate('addTask')}
      /> */}
    </React.Fragment>
  )
}

export default TaskList
