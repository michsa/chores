import React from 'react'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { Pressable } from 'react-native'
import { useTheme } from '@emotion/react'
import { sortBy } from 'lodash'

import { Spacer } from '.'
import TaskListItem from './TaskListItem'

import { useSelector, useFlags, useDispatch } from '../hooks'
import { getFilteredTasks } from '../redux/selectors'
import { savePins } from '../redux/thunks'
import { TaskWithTagsAndCompletions, NavigationProps, Filter } from '../types'
import { calcUrgency } from '../utils'
import { useNavigation } from '@react-navigation/core'

type Props = {
  filter: Filter,
  query?: string
}

const FilteredTasks = ({ filter, query }: Props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProps['root']>()

  const tasks = useSelector(getFilteredTasks, filter).filter(
    task => !query || task.settings.name.includes(query)
    // || task.tags.some(t => t.name.includes(query))
  )

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
      contentContainerStyle={{ paddingHorizontal: theme.spacing.xs }}
      ItemSeparatorComponent={() => <Spacer size="s" />}
      ListHeaderComponent={Spacer}
      ListFooterComponent={Spacer}
      initialNumToRender={1}
      // hack to force rerendering tasks in the list when they're completed
      keyExtractor={task => task.id + task.runningPoints}
      renderItem={({ item }: { item: TaskWithTagsAndCompletions }) => (
        <Pressable
          onPress={() => navigation.navigate('singleTaskView', { id: item.id })}
          onLongPress={() => {
            togglePin(item.id)
            dispatch(savePins(enabled))
            // console.log(ref.current)
            // @ts-ignore
            ref.current.scrollToPosition(0, 0, true)
          }}>
          <TaskListItem
            {...{
              item,
              onEdit: () => navigation.navigate('editTask', { id: item.id }),
              onComplete: () =>
                navigation.navigate('completeTask', { id: item.id }),
            }}
          />
        </Pressable>
      )}
    />
  )
}

export default FilteredTasks
