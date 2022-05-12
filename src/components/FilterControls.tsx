import React, { useEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
import { mapValues, negate, isEqual } from 'lodash'
import { useForm } from '../hooks'
import { Theme } from '../theme'
import { TaskWithCompletions } from '../types'
import {
  SpacedList,
  Row,
  Card,
  Icon,
  IconButton,
  IconButtonProps,
  TextInput,
  Section,
  Picker,
} from '.'
import TagPicker from './TagPicker'
import { scheduledDate } from '../utils'

/**
 * an icon button with different styling depending on whether the filter it's
 * associated with is active (state is set), or selected (widget is rendered).
 */
type FilterButtonProps = IconButtonProps & {
  isSelected: boolean
  isActive: boolean
}
// if filter is active, accent/primary
// if selected, underline/primary or highlight/primary
const FilterButton = ({
  isSelected,
  isActive,
  ...props
}: FilterButtonProps) => {
  const selectedBg = (p: boolean) => (p ? 'highlight' : 'underline')
  const defaultBg = (p: boolean) => (p ? 'highlight' : 'foreground')
  return (
    <IconButton
      color={isActive ? 'accent' : 'primaryText'}
      backgroundColor={isSelected ? selectedBg : defaultBg}
      {...props}
    />
  )
}

export type Filter = (t: TaskWithCompletions) => boolean

/**
 * source of truth for the state type for each widget, since this component has
 * to control state for all of them. the other types are derived from this.
 */
type FilterState = {
  search: string
  tags: string[]
  completion: 'upcoming' | 'completed' | 'todo' | 'all'
  recurrence: 'recurring' | 'once' | 'all'
}

/**
 * filter components need to translate a heterogeneous set of inputs/state into
 * an array of filters (task => boolean). getting from state to a filter is
 * easy but the other way around is impossible, meaning that these components
 * can't take filters as input because they won't be able to initialize state
 * from them. instead we
 */
type FilterComponentProps<T = unknown> = {
  theme: Theme
  onChangeState: (state: T) => void
  state: T
}
type FilterWidget<K extends keyof FilterState, T = FilterState[K]> = {
  component: React.ComponentType<FilterComponentProps<T>>
  mapStateToFilters: (state: T) => Filter[]
  emptyState: T
}

const isRecurring: Filter = task => task.settings.isRecurring
const hasBeenCompleted: Filter = task => task.completions.some(c => c.isFull)

const isFuture: Filter = task => scheduledDate(task) > new Date()

const isActive: Filter = task =>
  !isFuture(task) && (isRecurring(task) || !hasBeenCompleted(task))

const isUpcoming: Filter = task =>
  isFuture(task) && (isRecurring(task) || !hasBeenCompleted(task))

const isCompleted: Filter = task => hasBeenCompleted(task) && !isActive(task)

const filterWidgets: {
  [key in keyof FilterState]: FilterWidget<key>
} = {
  search: {
    component: ({ theme, state, onChangeState }) => (
      <Row>
        <Icon name="search" />
        <TextInput
          placeholder="Search..."
          style={{ flex: 1, height: theme.sizes.buttonHeight }}
          value={state}
          onChangeText={onChangeState}
        />
      </Row>
    ),
    mapStateToFilters: query => [task => task.settings.name.includes(query)],
    emptyState: '',
  },
  tags: {
    component: ({ state, onChangeState }) => (
      <TagPicker value={state} onChange={onChangeState} />
    ),
    mapStateToFilters: tagIds => [
      task => tagIds.every(id => task.tagIds.includes(id)),
    ],
    emptyState: [],
  },
  completion: {
    component: ({ theme, state, onChangeState }) => (
      <Row>
        <Icon name="check-circle" />
        <Picker
          containerStyle={{ height: theme.sizes.buttonHeight }}
          selectedValue={state}
          onValueChange={onChangeState}
          options={[
            { label: 'To do', value: 'todo' },
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Completed', value: 'completed' },
            { label: 'All', value: 'all' },
          ]}
        />
      </Row>
    ),
    mapStateToFilters: state =>
      ({
        upcoming: [isUpcoming],
        completed: [isCompleted],
        todo: [isActive],
        all: [],
      }[state]),
    emptyState: 'todo',
  },
  recurrence: {
    component: ({ theme, state, onChangeState }) => (
      <Row>
        <Icon name="repeat" />
        <Picker
          containerStyle={{ height: theme.sizes.buttonHeight }}
          selectedValue={state}
          onValueChange={onChangeState}
          options={[
            { label: 'Recurring', value: 'recurring' },
            { label: 'One-off', value: 'once' },
            { label: 'All', value: 'all' },
          ]}
        />
      </Row>
    ),
    mapStateToFilters: state =>
      state === 'recurring'
        ? [isRecurring]
        : state === 'once'
        ? [negate(isRecurring)]
        : [],
    emptyState: 'all',
  },
}

const filterIcons: { icon: string; key: keyof FilterState }[] = [
  { key: 'search', icon: 'search' },
  { key: 'tags', icon: 'tag' },
  // { key: 'priority', icon: 'flag' },
  // { key: 'date', icon: 'calendar' },
  // { key: 'points', icon: 'star' },
  { key: 'completion', icon: 'check-circle' },
  { key: 'recurrence', icon: 'repeat' },
]

const filterIsActive = (state: FilterState, key: keyof FilterState): boolean =>
  !isEqual(state[key], filterWidgets[key].emptyState)

const getFilterWidget = (key: keyof FilterState) =>
  filterWidgets[key] as FilterWidget<typeof key>

type FilterControlsProps = {
  // filters: FilterState
  onChangeFilters: (filters: Filter[]) => void
}
const FilterControls = ({ onChangeFilters }: FilterControlsProps) => {
  const theme = useTheme()
  const [selectedFilter, setSelectedFilter] = useState<
    keyof FilterState | undefined
  >('search')
  const { form, setField } = useForm<FilterState>(
    mapValues(filterWidgets, x => x.emptyState) as FilterState
  )

  useEffect(() => {
    const filters = filterIcons.flatMap(({ key }) =>
      getFilterWidget(key).mapStateToFilters(form[key])
    )
    onChangeFilters(filters)
  }, [form])

  const renderFilterComponent = () => {
    if (!selectedFilter) return null
    const FilterComponent = getFilterWidget(selectedFilter).component
    return (
      <FilterComponent
        theme={theme}
        state={form[selectedFilter] as FilterState[typeof selectedFilter]}
        onChangeState={setField(selectedFilter)}
      />
    )
  }

  return (
    <Section
      style={{
        marginTop: 0,
        paddingVertical: theme.spacing.s,
        marginHorizontal: theme.spacing.s,
        borderBottomWidth: 1,
        borderColor: theme.colors.highlight,
      }}>
      <SpacedList as={Card}>
        <Row>
          <Icon name="filter" />
          <Row style={{ flex: 1 /*justifyContent: 'space-evenly'*/ }}>
            {filterIcons.map(({ key, icon }) => (
              <FilterButton
                key={key}
                isSelected={selectedFilter === key}
                isActive={filterIsActive(form, key)}
                name={icon}
                onPress={() =>
                  setSelectedFilter(currentFilter =>
                    currentFilter === key ? undefined : key
                  )
                }
                onLongPress={() =>
                  setField(key)(getFilterWidget(key).emptyState)
                }
              />
            ))}
          </Row>
        </Row>
        {renderFilterComponent()}
      </SpacedList>
    </Section>
  )
}
export default FilterControls
