import React from 'react'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { Pressable } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy, last } from 'lodash'

import { Card, Text, Icon, IconButton, Spacer, Row, SpacedList } from '.'
import PointsRemaining from './PointsRemaining'
import { useSelector, useFlags, useDispatch } from '../hooks'
import { getOrderedTasks } from '../redux/selectors'
import { isCompleted } from '../redux/filters'
import { savePins } from '../redux/thunks'
import {
  DateTime,
  TaskWithTagsAndCompletions,
  Completion,
  FilterWithCompletions,
  NavigationProps,
} from '../types'
import {
  priorityLabel,
  printRelativeDate,
  calcUrgency,
  toDate,
  FilterConfig,
} from '../utils'
import { Theme } from '../theme'
import { useNavigation } from '@react-navigation/core'

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
  <DetailSection {...props} text={printRelativeDate(date)} />
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

const FilteredTasks = ({ filterConfig }: { filterConfig: FilterConfig }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProps['taskList']>()

  const tasks = useSelector(getOrderedTasks, filterConfig)

  // pinned tasks stick to the top of the task list
  const pins = useSelector(state => state.pins)
  const { isSet: isPinned, toggle: togglePin, enabled } = useFlags(pins)

  const theme = useTheme()

  const sortedTasks = sortBy(
    tasks,
    t => -calcUrgency(t) - (isPinned(t.id) ? 1000 : 0)
  )

  const ref = React.useRef(null)

  return (
    <KeyboardAwareFlatList
      ref={ref}
      keyboardShouldPersistTaps="always"
      data={sortedTasks}
      ItemSeparatorComponent={() => <Spacer size="s" />}
      ListHeaderComponent={Spacer}
      ListFooterComponent={Spacer}
      initialNumToRender={1}
      // hack to force rerendering tasks in the list when they're completed
      keyExtractor={task => task.id + task.runningPoints}
      renderItem={({ item }: { item: TaskWithTagsAndCompletions }) => (
        <Pressable
          onPress={() => navigation.navigate('viewTask', { id: item.id })}
          onLongPress={() => {
            togglePin(item.id)
            dispatch(savePins(enabled))
            // console.log(ref.current)
            // @ts-ignore
            ref.current.scrollToPosition(0, 0, true)
          }}>
          <Row
            as={Card}
            style={{
              paddingHorizontal: theme.spacing.m,
              borderLeftWidth: theme.spacing.s,
              borderColor: isPinned(item.id)
                ? theme.colors.pin
                : isCompleted(item)
                ? theme.colors.accent
                : item.settings.deadline
                ? theme.colors.danger
                : theme.colors.highlight,
              // backgroundColor: isPinned(item.id)
              //   ? theme.colors.pin
              //   : theme.colors.foreground,
            }}>
            <SpacedList style={{ flex: 1 }} spacing="s" spacer={Spacer}>
              <Row>
                {isPinned(item.id) && (
                  <Icon
                    size="small"
                    // style={{ margin: -4 }}
                    name="pin"
                    color={isPinned(item.id) ? 'pin' : 'underline'}
                    // onPress={() => togglePin(item.id)}
                  />
                )}
                <Row
                  as={Text}
                  style={{
                    paddingHorizontal: theme.spacing.s,
                    height: theme.iconSizes.xlarge,
                    minWidth: theme.iconSizes.xlarge,
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

                {item.settings.type === 'recurring' && (
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
                  <DateSection icon="calendar" date={item.settings.scheduled} />
                )}
                {!!item.settings.deadline && (
                  <DateSection
                    icon="alert-circle"
                    color="danger"
                    date={item.settings.deadline}
                  />
                )}
                {!item.settings.deadline && !item.settings.scheduled && (
                  <DateSection icon="plus-circle" date={item.createdAt} />
                )}
                <DetailSection
                  color="placeholderText"
                  icon="alert-triangle"
                  // iconSize="xsmall"
                  text={calcUrgency(item).toFixed(2)}
                />
              </Row>
            </SpacedList>
            {!isCompleted(item) && (
              <IconButton
                variant="primary"
                name="check-circle"
                color="accent"
                size="xlarge"
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
  )
}

export default FilteredTasks
