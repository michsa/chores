import React, { useLayoutEffect, useState } from 'react'
import { View, ScrollView, Modal } from 'react-native'
import { useTheme } from '@emotion/react'
import styled from '@emotion/native'

import {
  Text,
  Card,
  HeaderIcon,
  Row,
  SpacedList,
  Icon,
  Tag,
} from '../components'
import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/thunks'
import { getTaskWithTags } from '../redux/selectors'
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

  const [modal, setModal] = useState(false)

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
          <HeaderIcon name="check-circle" onPress={() => setModal(true)} />
        </Row>
      ),
    })
  }, [navigation, task])

  if (!task) return null
  return (
    <ScrollView>
      <Modal transparent visible={modal} onRequestClose={() => setModal(false)}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: 200, height: 200 }}>
            <Text>Complete task</Text>
          </Card>
        </View>
      </Modal>
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
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              margin: -theme.spacing.xxs,
            }}>
            {task.tags.map(t => (
              <Tag key={t.id} style={{ margin: theme.spacing.xxs }}>
                {t.name}
              </Tag>
            ))}
          </View>
        </Row>

        <Card>
          <Text>Notes</Text>
          <Text variant="property">{task.settings.description}</Text>
        </Card>
      </SpacedList>
    </ScrollView>
  )
}

export default ViewTask
