import React, { useLayoutEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { useTheme } from '@emotion/react'
import styled from '@emotion/native'

import {
  Text,
  Card,
  Spacer,
  HeaderIcon,
  Row,
  SpacedList,
  Icon,
} from '../components'
import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import { NavigationProps } from '../types'
import { priorityLabel, printRecurrence } from '../utils'

const ViewCard = styled(Card)(({ theme }) => ({
  paddingVertical: theme.spacing.m,
}))

const ViewTask = ({
  navigation,
  route: {
    params: { id },
  },
}: NavigationProps['viewTask']) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const task = useSelector(getTaskById(id))

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Row spacing="l">
          <HeaderIcon
            name="trash-2"
            color="danger"
            onPress={() => {
              dispatch(deleteTask(id))
              navigation.navigate('taskList')
            }}
          />
          <HeaderIcon
            name="edit"
            color="text"
            onPress={() => navigation.navigate('editTask', { id })}
          />
          <HeaderIcon name="check-circle" onPress={() => {}} />
        </Row>
      ),
    })
  }, [navigation, task])

  if (!task) return null
  return (
    <ScrollView>
      <SpacedList style={{ margin: theme.spacing.s }}>
        <ViewCard>
          <Text variant="primary" style={{ fontSize: theme.fontSizes.large }}>
            {task.settings.name}
          </Text>
        </ViewCard>
        <Row>
          <Row as={ViewCard} style={{ flex: 2 }}>
            <Icon name="star" />
            <Text variant="primary">{task.settings.points}</Text>
          </Row>
          <Row as={ViewCard} style={{ flex: 3 }}>
            <Icon name="flag" />
            <Text variant="primary">
              {priorityLabel(task.settings.priority)}
            </Text>
          </Row>
        </Row>

        <Row as={ViewCard}>
          <Icon name="tag" />
          <Text variant="primary">{task.settings.tags.join(' ')}</Text>
        </Row>

        {!!task.settings.scheduled && (
          <Row as={ViewCard}>
            <Icon name="calendar" />
            <Text variant="primary">
              {new Date(task.settings.scheduled).toDateString()}
            </Text>
          </Row>
        )}
        {!!task.settings.deadline && (
          <Row
            as={ViewCard}
            style={{ flex: 3, justifyContent: 'space-between' }}>
            <Row>
              <Icon name="alert-circle" />
              <Text variant="primary">
                {new Date(task.settings.deadline).toDateString()}
              </Text>
            </Row>
            <Spacer />
            {!!task.settings.deadlineWarning && (
              <Text>
                Notify {printRecurrence(task.settings.deadlineWarning)} before
              </Text>
            )}
          </Row>
        )}

        <Card>
          <Text>Notes</Text>
          <Text variant="property">{task.settings.description}</Text>
        </Card>
      </SpacedList>
    </ScrollView>
  )
}

export default ViewTask
