import React, { useLayoutEffect, useState } from 'react'
import { View, ScrollView, Modal } from 'react-native'
import { useTheme } from '@emotion/react'
import styled from '@emotion/native'

import {
  Text,
  Card,
  IconButton,
  Row,
  SpacedList,
  Icon,
  Tag,
} from '../components'
import TagList from '../components/TagList'
import PointsRemaining from '../components/PointsRemaining'
import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/thunks'
import { getTaskWithTags, getTaskCompletions } from '../redux/selectors'
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
  const task = useSelector(getTaskWithTags, id)
  const completions = useSelector(getTaskCompletions, id)

  const [modal, setModal] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Row spacing="l">
          <IconButton
            name="trash-2"
            color="danger"
            onPress={() => {
              dispatch(deleteTask(id))
              navigation.navigate('taskList')
            }}
          />
          <IconButton
            name="edit"
            color="text"
            onPress={() => navigation.navigate('editTask', { id })}
          />
          <IconButton
            variant="primary"
            size="xlarge"
            name="check-circle"
            onPress={() => navigation.navigate('completeTask', { id })}
          />
        </Row>
      ),
    })
  }, [navigation, task])

  if (!task) return null

  const pointsRemaining = task.settings.points - (task.runningPoints ?? 0)

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
            <PointsRemaining task={task} />
          </Row>
          <Row as={ViewCard} style={{ flex: 3 }}>
            <Icon name="flag" />
            <Text variant="primary">
              {priorityLabel(task.settings.priority)}
            </Text>
          </Row>
        </Row>

        {(!!task.settings.scheduled || !!task.settings.deadline) && (
          <Row as={ViewCard} style={{ justifyContent: 'space-between' }}>
            {!!task.settings.scheduled && (
              <Row>
                <Icon name="calendar" />
                <Text variant="primary">
                  {new Date(task.settings.scheduled).toDateString()}
                </Text>
              </Row>
            )}
            {!!task.settings.deadline && (
              <Row spacing="l">
                <Icon name="alert-circle" />
                <SpacedList>
                  <Text variant="primary">
                    {new Date(task.settings.deadline).toDateString()}
                  </Text>
                </SpacedList>
              </Row>
            )}
            <SpacedList style={{ alignItems: 'flex-end' }}>
              {!!task.settings.deadlineWarning && (
                <Row>
                  <Icon size="small" name="calendar" />
                  <Text>
                    {printRecurrence(task.settings.deadlineWarning)} before
                  </Text>
                </Row>
              )}
              {!!task.settings.isRecurring && (
                <Row>
                  <Icon size="small" name="repeat" />
                  <Text>
                    after {printRecurrence(task.settings.recurrence!)}
                  </Text>
                </Row>
              )}
            </SpacedList>
          </Row>
        )}

        <Row as={ViewCard}>
          <Icon name="tag" />
          <TagList tags={task.tags} />
        </Row>

        <Card>
          <Text>Notes</Text>
          <Text variant="property">{task.settings.description}</Text>
        </Card>
        {completions.map(c => (
          <Row as={Card} key={c.id}>
            <Text>{new Date(c.date).toDateString()}</Text>
          </Row>
        ))}
      </SpacedList>
    </ScrollView>
  )
}

export default ViewTask
