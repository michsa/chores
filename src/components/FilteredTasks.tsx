import React from 'react'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useTheme } from '@emotion/react'
import { sortBy, partition } from 'lodash'

import { Spacer } from '.'
import TaskListItem from './TaskListItem'

import { useSelector, useFlags, useDispatch } from '../hooks'
import { getFilteredTasks } from '../redux/selectors'
import { savePins } from '../redux/thunks'
import { TaskWithTagsAndCompletions, NavigationProps, Filter } from '../types'
import { calcUrgency } from '../utils'
import { useNavigation } from '@react-navigation/core'

type Props = {
  filter: Filter
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

  // const [pinnedTasks, unpinnedTasks] = partition(tasks, t => isPinned(t.id))
  // const sortedTasks = sortBy(unpinnedTasks, t => -calcUrgency(t))
  const sortedTasks = sortBy(
    tasks,
    t => -calcUrgency(t) - (isPinned(t.id) ? 1000 : 0)
  )

  const ref = React.useRef(null)

  return (
    <KeyboardAwareFlatList
      ref={ref}
      keyboardShouldPersistTaps="always"
      // data={[...pinnedTasks, ...sortedTasks]}
      data={sortedTasks}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.xs }}
      ItemSeparatorComponent={() => <Spacer size="s" />}
      ListHeaderComponent={Spacer}
      // the parent component has a floating footer button, so we want to add
      // empty space to the end of the list so that the last element can scroll
      // above the button.  hacky and imprecise, but it works
      ListFooterComponent={() => (
        <Spacer style={{ minHeight: theme.iconSizes.footerButton * 2 }} />
      )}
      initialNumToRender={1}
      // hack to force rerendering tasks in the list when they're completed
      keyExtractor={task => task.id + task.runningPoints}
      renderItem={({ item }: { item: TaskWithTagsAndCompletions }) => (
        <TaskListItem
          onPress={() => navigation.navigate('singleTaskView', { id: item.id })}
          onLongPress={() => {
            togglePin(item.id)
            dispatch(savePins(enabled))
            // console.log(ref.current)
            // @ts-ignore
            ref.current.scrollToPosition(0, 0, true)
          }}
          isPinned={isPinned(item.id)}
          item={item}
          onEdit={() => navigation.navigate('editTask', { id: item.id })}
          onComplete={() =>
            navigation.navigate('completeTask', { id: item.id })
          }
        />
      )}
    />
  )
}

export default FilteredTasks
