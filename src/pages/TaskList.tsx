import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { Pressable } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy } from 'lodash'

import {
  Card,
  Text,
  Icon,
  IconButton,
  Spacer,
  Row,
  SpacedList,
  Button,
} from '../components'
import TagList from '../components/TagList'
import PointsRemaining from '../components/PointsRemaining'
import FilterControls, { Filter } from '../components/FilterControls'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { NavigationProps, DateTime, TaskWithTagsAndCompletions } from '../types'
import { priorityLabel, printDate, calcUrgency } from '../utils'
import { Theme } from '../theme'

const composeFilters =
  (filters: Filter[]): Filter =>
  task =>
    filters.every(filter => filter(task))

type DetailSectionProps = {
  icon: string
  text: any
  color?: keyof Theme['colors']
}
const DetailSection = ({ icon, text, color }: DetailSectionProps) => (
  <Row spacing="xs">
    <Icon color={color} name={icon} size="small" />
    <Text color={color}>{text}</Text>
  </Row>
)

const DateSection = ({
  date,
  ...props
}: { date: number | DateTime } & Omit<DetailSectionProps, 'text'>) => (
  <DetailSection {...props} text={printDate(date)} />
)

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const tasks = useSelector(getOrderedTasks)
  const theme = useTheme()

  const [filters, setFilters] = useState<Filter[]>([])
  const filteredTasks = sortBy(
    tasks.filter(composeFilters(filters)),
    t => -calcUrgency(t)
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Row spacing="l">
          <Button
            style={{ minHeight: theme.sizes.headerButtonHeight }}
            color="headerForeground"
            icon="sort-desc"
            title="Urgency"
          />
          <IconButton
            variant="primary"
            size="xlarge"
            name="plus"
            onPress={() => navigation.navigate('addTask')}
          />
        </Row>
      ),
      title: `Tasks (${filteredTasks.length})`,
    })
  }, [navigation, filteredTasks])

  return (
    <React.Fragment>
      <FilterControls onChangeFilters={setFilters} />
      <KeyboardAwareFlatList
        style={{ paddingHorizontal: theme.spacing.s }}
        data={filteredTasks}
        ItemSeparatorComponent={() => <Spacer size="m" />}
        ListHeaderComponent={Spacer}
        ListFooterComponent={Spacer}
        renderItem={({ item }: { item: TaskWithTagsAndCompletions }) => (
          <Pressable
            onPress={() => navigation.navigate('viewTask', { id: item.id })}>
            <Row as={Card} style={{ paddingRight: theme.spacing.m }}>
              <SpacedList style={{ flex: 1 }} spacing="s">
                <Row>
                  <Row
                    as={Text}
                    style={{
                      paddingHorizontal: theme.spacing.s,
                      paddingVertical: theme.spacing.xxs,
                      borderRadius: theme.spacing.xl,
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      backgroundColor: theme.colors.highlight,
                    }}
                    size="regular"
                    color="primaryText"
                    spacing="xs">
                    <PointsRemaining task={item} />
                  </Row>

                  {item.settings.isRecurring && (
                    <Icon size="small" name="repeat" />
                  )}
                  <Text variant="primary" style={{ fontSize: 18 }}>
                    {item.settings.name}
                  </Text>
                </Row>
                <Row
                  spacing="m"
                  style={{
                    justifyContent: 'flex-start',
                    flex: 0,
                    width: 'auto',
                  }}>
                  {!!item.settings.priority && (
                    <DetailSection
                      icon="flag"
                      color="accent"
                      text={priorityLabel(item.settings.priority)}
                    />
                  )}
                  {!!item.settings.scheduled && (
                    <DateSection
                      icon="calendar"
                      date={item.settings.scheduled}
                    />
                  )}
                  {!!item.settings.deadline && (
                    <DateSection
                      icon="alert-circle"
                      date={item.settings.deadline}
                    />
                  )}
                  {!item.settings.deadline && !item.settings.scheduled && (
                    <DateSection icon="clock" date={item.createdAt} />
                  )}
                  <DetailSection
                    color="placeholderText"
                    icon="alert-triangle"
                    // iconSize="xsmall"
                    text={calcUrgency(item).toFixed(2)}
                  />
                </Row>
                {!!item.tags.length && (
                  <Row spacing="xs">
                    <Icon name="tag" size="small" />
                    <TagList tags={item.tags} variant="small" />
                  </Row>
                )}
              </SpacedList>
              <IconButton
                name="check-circle"
                color="accent"
                size="xxlarge"
                onPress={() =>
                  navigation.navigate('completeTask', { id: item.id })
                }
              />
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
