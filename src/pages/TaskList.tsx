import React, { useLayoutEffect, useState } from 'react'
import { Pressable, FlatList, View } from 'react-native'
import { useTheme } from '@emotion/react'

import {
  Card,
  Text,
  Icon,
  IconButton,
  Spacer,
  Row,
  SpacedList,
  TextInput,
} from '../components'
import TagList from '../components/TagList'
import TagPicker from '../components/TagPicker'
import { useSelector } from '../hooks'
import { getOrderedTasksWithTags, getTags } from '../redux/selectors'
import { NavigationProps } from '../types'
import { priorityLabel } from '../utils'
import { Theme } from '../theme'

const TaskList = ({ navigation }: NavigationProps['taskList']) => {
  const tasks = useSelector(getOrderedTasksWithTags)
  const theme = useTheme()

  const [query, setQuery] = useState('')
  const [tagIds, setTagIds] = useState<string[]>([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Row spacing="l">
          <IconButton name="sliders" color="text" onPress={() => {}} />
          <IconButton name="filter" color="text" />
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

  const DetailSection = ({
    icon,
    text,
    color,
  }: {
    icon: string
    text: any
    color?: keyof Theme['colors']
  }) => (
    <Row spacing="xs">
      <Icon color={color} name={icon} size="small" />
      <Text color={color}>{text}</Text>
    </Row>
  )

  const filteredTasks = tasks.filter(
    task =>
      task.settings.name.includes(query) &&
      tagIds.every(id => task.tagIds.includes(id))
  )

  return (
    <React.Fragment>
      <SpacedList as={Card}>
        <Row>
          <Icon name="search" />
          <TextInput
            style={{ flex: 1, height: theme.sizes.buttonHeight }}
            value={query}
            onChangeText={setQuery}
          />
          <IconButton
            containerProps={{ style: { padding: theme.spacing.s } }}
            name="chevron-down"
            color="text"
          />
        </Row>
        <TagPicker
          value={tagIds}
          onChange={setTagIds}
        />
      </SpacedList>
      <FlatList
        style={{ margin: theme.spacing.s }}
        data={filteredTasks}
        ItemSeparatorComponent={() => <Spacer size="m" />}
        renderItem={({ item }) => (
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
                      borderWidth: 1,
                      borderColor: theme.colors.text,
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      // backgroundColor: theme.colors.accent,
                    }}
                    // color="primaryText"
                    spacing="xs">
                    {item.settings.points}
                  </Row>

                  {item.settings.isRecurring && (
                    <Icon size="small" name="repeat" />
                  )}
                  <Text variant="primary" style={{ fontSize: 18 }}>
                    {item.settings.name}
                  </Text>
                </Row>
                <Row spacing="m" style={{ flex: 12 }}>
                  {!!item.settings.priority && (
                    <View style={{ flex: 0 }}>
                      <DetailSection
                        icon="flag"
                        text={priorityLabel(item.settings.priority)}
                      />
                    </View>
                  )}
                  <View style={{ flex: 5 }}>
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
                    {!item.settings.deadline && !item.settings.scheduled && (
                      <DetailSection
                        icon="clock"
                        text={new Date(item.createdAt).toDateString()}
                      />
                    )}
                  </View>
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
