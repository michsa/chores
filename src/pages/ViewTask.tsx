import React, { useLayoutEffect } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy, reverse, isEmpty } from 'lodash'

import {
  Text,
  Card,
  ViewCard,
  IconButton,
  Row,
  SpacedList,
  Icon,
  Divider,
} from '../components'
import TagList from '../components/TagList'
import PointsRemaining from '../components/PointsRemaining'
import BucketSize from '../components/BucketSize'
import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/thunks'
import { getTaskWithTags, getTaskCompletions } from '../redux/selectors'
import { ScreenProps } from '../types'
import {
  priorityLabel,
  printInterval,
  printDate,
  toDate,
  calcUrgency,
} from '../utils'

const ViewTask = ({
  navigation,
  route: {
    params: { id },
  },
}: ScreenProps['viewTask']) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const task = useSelector(getTaskWithTags, id)
  const completions = useSelector(getTaskCompletions, id)

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

  const urgency = calcUrgency({ ...task, completions })
  return (
    <ScrollView>
      <SpacedList style={{ margin: theme.spacing.s }}>
        <Row spacing="l" as={ViewCard}>
          {task.settings.type === 'bucket' && (
            <Icon
              name="archive"
              color="primaryText"
              style={{
                backgroundColor: theme.colors.highlight,
                borderRadius: theme.spacing.xl,
                paddingVertical: theme.spacing.xs + theme.spacing.xxs,
                paddingHorizontal: theme.spacing.s,
                marginVertical: -theme.spacing.xs,
                marginHorizontal: -theme.spacing.xs,
              }}
            />
          )}
          <Text variant="primary" size="large" style={{ flex: 1 }}>
            {task.settings.name}
          </Text>
          <Row>
            <Icon name="alert-triangle" size="small" />
            <Text>{urgency.toFixed(2)}</Text>
          </Row>
        </Row>
        <Row>
          <Row as={ViewCard} style={{ flex: 2 }}>
            <Icon name="star" />
            {task.settings.type === 'bucket' ? (
              <BucketSize {...task.settings} />
            ) : (
              <PointsRemaining {...task} />
            )}
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
                  {printDate(task.settings.scheduled)}
                </Text>
              </Row>
            )}
            {!!task.settings.deadline && (
              <Row spacing="l">
                <Icon name="alert-circle" />
                <SpacedList>
                  <Text variant="primary">
                    {printDate(task.settings.deadline)}
                  </Text>
                </SpacedList>
              </Row>
            )}
            <SpacedList style={{ alignItems: 'flex-end' }}>
              {!isEmpty(task.settings.deadlineWarning) && (
                <Row>
                  <Icon size="small" name="calendar" />
                  <Text>
                    {printInterval(task.settings.deadlineWarning)} before
                  </Text>
                </Row>
              )}
              {task.settings.type === 'recurring' && (
                <Row>
                  <Icon size="small" name="repeat" />
                  <Text>after {printInterval(task.settings.interval)}</Text>
                </Row>
              )}
            </SpacedList>
          </Row>
        )}

        <Row as={ViewCard}>
          <Icon name="tag" />
          <TagList tags={task.tags} />
        </Row>

        {!!task.settings.notes && (
          <Card>
            <Text>Notes</Text>
            <Text variant="property">{task.settings.notes}</Text>
          </Card>
        )}

        {/* <Text>{JSON.stringify(task.settings, null, 2)}</Text> */}

        {completions.length && (
          <SpacedList>
            <Divider size="xs" />

            <Row
              style={{
                padding: theme.spacing.xs,
              }}>
              <Icon color="primaryText" size="small" name="check" />
              <Text
                size="regular"
                color="primaryText"
                style={{ fontWeight: '500' }}>
                Completions
              </Text>
            </Row>

            {reverse(sortBy(completions, c => toDate(c.date))).map(c => (
              <SpacedList key={c.id} as={Card}>
                <Row style={{ minHeight: theme.iconSizes.xxlarge }}>
                  <Row style={{ flex: 1 }} spacing="l">
                    <Icon
                      name={c.isFull ? 'check-circle' : 'circle'}
                      color={c.isFull ? 'primaryText' : 'primaryText'}
                    />
                    <Row>
                      <Icon size="small" name="star" />
                      <Text variant="primary">{c.points}</Text>
                    </Row>
                    <Row>
                      <Icon size="small" name="stopwatch" />
                      <Text variant="primary">
                        {printDate(c.date, 'short')}
                      </Text>
                    </Row>
                  </Row>
                  <IconButton
                    size="small"
                    name="edit-2"
                    color="text"
                    containerStyle={{ marginRight: -theme.spacing.xs }}
                  />
                </Row>
                {c.notes && <Text>{c.notes}</Text>}
              </SpacedList>
            ))}
          </SpacedList>
        )}
      </SpacedList>
    </ScrollView>
  )
}

export default ViewTask
