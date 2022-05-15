import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { Pressable } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy, memoize, last } from 'lodash'

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
import FilterControls from '../components/FilterControls'
import { useSelector } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { isCompleted, isActive } from '../redux/filters'
import {
  NavigationProps,
  DateTime,
  TaskWithTagsAndCompletions,
  Completion,
  FilterWithCompletions,
} from '../types'
import { priorityLabel, printDate, calcUrgency, toDate } from '../utils'
import { Theme } from '../theme'

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

const LastCompletionSection = ({
  completions,
}: {
  completions: Completion[]
}) => {
  const lastCompletion = last(
    sortBy(
      completions, //.filter(c => c.isFull),
      c => toDate(c.date)
    )
  )
  return lastCompletion ? (
    <DateSection
      icon={lastCompletion.isFull ? 'check-circle' : 'circle'}
      date={lastCompletion.date}
    />
  ) : null
}

// const lastCompletionDate = memoize(
//   flow([sb<Completion>(c => toDate(c.date)), last, get('date')]),
//   map((c: Completion) => c.id)
// )

// const lastCompletion = memoize(
//   (completions: Completion[]) =>
//     last(
//       sortBy(
//         completions.filter(c => c.isFull),
//         c => toDate(c.date)
//       )
//     ),
//   completions => completions.filter(c => c.isFull).map(c => c.id)
// )

// const lastCompletionDate2 = memoize(
//   (completions: Completion[]) => completions[completions.length - 1].date,
//   completions => completions.map(c => c.id)
// )

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const [filters, setFilters] = useState<FilterWithCompletions[]>([])
  const tasks = useSelector(getOrderedTasks, filters)
  const theme = useTheme()

  const sortedTasks = sortBy(tasks, t => -calcUrgency(t))
  console.log(sortedTasks)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Row spacing="l">
          <Button
            style={{ minHeight: theme.sizes.headerButtonHeight }}
            color="headerForeground"
            icon="sort-desc"
            title="Urgency"
            onPress={() => navigation.navigate('metrics')}
          />
          <IconButton
            variant="primary"
            size="xlarge"
            name="plus"
            onPress={() => navigation.navigate('addTask')}
          />
        </Row>
      ),
      title: `Tasks (${sortedTasks.length})`,
    })
  }, [navigation, sortedTasks])

  return (
    <React.Fragment>
      <FilterControls onChangeFilters={setFilters} />
      <KeyboardAwareFlatList
        keyboardShouldPersistTaps="always"
        style={{ paddingHorizontal: theme.spacing.s }}
        data={sortedTasks}
        ItemSeparatorComponent={() => <Spacer size="m" />}
        ListHeaderComponent={Spacer}
        ListFooterComponent={Spacer}
        // hack to force rerendering tasks in the list when they're completed
        keyExtractor={task => task.id + task.runningPoints}
        renderItem={({ item }: { item: TaskWithTagsAndCompletions }) => (
          <Pressable
            onPress={() => navigation.navigate('viewTask', { id: item.id })}>
            <Row
              as={Card}
              style={{
                paddingHorizontal: theme.spacing.m,
                borderLeftWidth: 8,
                borderColor: isCompleted(item)
                  ? theme.colors.accent
                  : item.settings.deadline
                  ? theme.colors.danger
                  : theme.colors.highlight,
              }}>
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
                    <PointsRemaining {...item} />
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
                      color="danger"
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
                <LastCompletionSection {...item} />
                {!!item.tags.length && (
                  <Row spacing="xs">
                    <Icon name="tag" size="small" />
                    <TagList tags={item.tags} variant="small" />
                  </Row>
                )}
              </SpacedList>
              {!isCompleted(item) && (
                <IconButton
                  name="check-circle"
                  color="accent"
                  size="xxlarge"
                  onPress={() =>
                    navigation.navigate('completeTask', { id: item.id })
                  }
                  disabled={isCompleted(item)}
                />
              )}
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
