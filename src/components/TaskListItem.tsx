import React from 'react'
import { Pressable, PressableProps, View } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy, last } from 'lodash'

import { Text, Icon, IconButton, Spacer, Row, SpacedList } from '.'
import TagList from './TagList'

import PointsRemaining from './PointsRemaining'
import { useSelector, useFlags } from '../hooks'
import { isCompleted } from '../utils/filters'
import { DateTime, TaskWithTagsAndCompletions, Completion } from '../types'
import {
  shortPriorityLabel,
  printRelativeDate,
  calcUrgency,
  toDate,
  printInterval,
  differenceInIntervals,
  scheduledDate,
} from '../utils'
import { Theme } from '../theme'

// copied from the urgency calc in util/math for now, so we can show info about
// buckets in the task list
const getBucketStats = (task: TaskWithTagsAndCompletions) => {
  const pointsInLastInterval = task.completions.reduce((points, c) => {
    const cDate = toDate(c.date)
    const diff = differenceInIntervals(
      task.settings.interval!,
      new Date(),
      cDate
    )
    const isWithinLastInterval = diff < 1
    return points + (isWithinLastInterval ? c.points : 0)
  }, 0)

  const pointsRemaining = task.settings.points - pointsInLastInterval
  const percentRemaining = pointsRemaining / task.settings.points
  return `${pointsInLastInterval}/${task.settings.points} (${(
    (1 - percentRemaining) *
    100
  ).toFixed(0)}%)`
}

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

type Props = PressableProps & {
  isPinned: boolean
  item: TaskWithTagsAndCompletions
  onEdit: () => void
  onComplete: () => void
}

const TaskListItem = ({
  item,
  isPinned,
  onEdit,
  onComplete,
  ...props
}: Props) => {
  const theme = useTheme()

  return (
    <Pressable
      {...props}
      android_ripple={{ color: theme.colors.highlight }}
      style={{
        backgroundColor: theme.colors.foreground,
        borderRadius: theme.spacing.s,
        borderLeftWidth: theme.spacing.s,
        borderColor: isPinned
          ? theme.colors.pin
          : isCompleted(item)
          ? theme.colors.accent
          : item.settings.deadline
          ? theme.colors.danger
          : theme.colors.highlight,
      }}>
      <Row
        style={{
          paddingHorizontal: theme.spacing.m,
          paddingVertical: theme.spacing.xs,
        }}>
        <SpacedList style={{ flex: 1 }} spacing="s" spacer={Spacer}>
          <Row>
            {isPinned && (
              <Icon
                size="small"
                // style={{ margin: -4 }}
                name="pin"
                color={isPinned ? 'pin' : 'underline'}
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
                text={shortPriorityLabel(item.settings.priority)}
              />
            )}
            {!item.settings.deadline &&
              !item.settings.scheduled &&
              !(item.settings.type === 'bucket') && (
                <DateSection icon="clock" date={item.createdAt} />
              )}
            {!!item.completions.length && (
              <LastCompletionSection completions={item.completions} />
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
            {item.settings.type === 'recurring' && (
              <DetailSection
                icon="repeat"
                text={`${printInterval(
                  item.settings.interval,
                  'short'
                )} (${differenceInIntervals(
                  item.settings.interval,
                  new Date(),
                  scheduledDate(item)
                ).toFixed(0)})`}
              />
            )}

            {item.settings.type === 'bucket' && (
              <DetailSection
                icon="repeat"
                text={printInterval(item.settings.interval, 'short')}
              />
            )}
            {item.settings.type === 'bucket' && (
              <DetailSection icon="star" text={getBucketStats(item)} />
            )}
          </Row>
          {/* <DetailSection
            icon="tag"
            text={<TagList tags={item.tags} variant="small" />}
          /> */}
        </SpacedList>
        <SpacedList style={{ alignSelf: 'flex-start' }}>
          <Row spacing="l">
            <IconButton
              variant="primary"
              size="regular"
              name="edit"
              color="underline"
              onPress={onEdit}
            />
            {!isCompleted(item) && (
              <IconButton
                variant="primary"
                name="check-circle"
                color="accent"
                containerStyle={{ alignSelf: 'flex-start' }}
                size="xxlarge"
                onPress={onComplete}
                disabled={isCompleted(item)}
              />
            )}
          </Row>
          <View style={{ alignSelf: 'flex-end' }}>
            <DetailSection
              color="placeholderText"
              icon="alert-triangle"
              // iconSize="xsmall"
              text={calcUrgency(item).toFixed(2)}
            />
          </View>
        </SpacedList>
      </Row>
    </Pressable>
  )
}

export default TaskListItem
