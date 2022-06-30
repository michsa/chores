import React, { useLayoutEffect } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy, reverse } from 'lodash'

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
import { useDispatch, useSelector } from '../hooks'
import { deleteTask } from '../redux/thunks'
import { getTaskWithTags, getTaskCompletions } from '../redux/selectors'
import { NavigationProps } from '../types'
import { priorityLabel, printRecurrence, printDate, toDate } from '../utils'

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
  return (
    <ScrollView>
      <SpacedList style={{ margin: theme.spacing.s }}>
        <ViewCard>
          <Text variant="primary" size="large">
            {task.settings.name}
          </Text>
        </ViewCard>
        <Row>
          <Row as={ViewCard} style={{ flex: 2 }}>
            <Icon name="star" />
            <PointsRemaining {...task} />
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
                  <Text>after {printRecurrence(task.settings.recurrence)}</Text>
                </Row>
              )}
            </SpacedList>
          </Row>
        )}

        <Row as={ViewCard}>
          <Icon name="tag" />
          <TagList tags={task.tags} />
        </Row>

        {!!task.settings.description && (
          <Card>
            <Text>Notes</Text>
            <Text variant="property">{task.settings.description}</Text>
          </Card>
        )}

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

            {reverse(sortBy(completions, c => toDate(c.date))).map(c => {
              // const [expanded, setExpanded] = useState(false)
              return (
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
                        <Text variant="primary">{printDate(c.date)}</Text>
                      </Row>
                      {/* {c.notes && (
                    <IconButton
                      size="small"
                      name={expanded ? 'chevron-down' : 'chevron-right'}
                      color={c.notes ? 'text' : 'foreground'}
                      onPress={() => setExpanded(x => !x)}
                    />
                  )} */}
                    </Row>
                    {/* <IconButton
                  size="small"
                  name="edit-2"
                  color="text"
                  containerStyle={{ marginRight: -theme.spacing.xs }}
                /> */}
                  </Row>
                  {c.notes && <Text>{c.notes}</Text>}
                </SpacedList>
              )
            })}
          </SpacedList>
        )}
      </SpacedList>
    </ScrollView>
  )
}

export default ViewTask
