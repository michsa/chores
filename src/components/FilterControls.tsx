import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useTheme } from '@emotion/react'
import { mapValues, negate, isEqual } from 'lodash'
import { useForm, useFlags } from '../hooks'
import { Theme } from '../theme'
import { FilterWithCompletions, DateTime } from '../types'
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
  Text,
  Spacer,
} from '.'
// import DateTimeInput from './DateTimeInput'
import TagPicker from './TagPicker'
import {
  isRecurring,
  isInProgress,
  isCompleted,
  isUpcoming,
  isActive,
} from '../redux/filters'
import { priorityOptions } from '../utils'
import NumberInput from './NumberInput'
import { Switch } from 'react-native-gesture-handler'

type BucketState = 'include' | 'exclude' | 'only'
const nextBucketState: { [k in BucketState]: BucketState } = {
  include: 'only',
  exclude: 'include',
  only: 'include',
}

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

/**
 * source of truth for the state type for each widget, since this component has
 * to control state for all of them. the other types are derived from this.
 */
type FilterState = {
  search: string
  tags: {
    include: string[]
    exclude: string[]
  }
  completion: 'upcoming' | 'completed' | 'todo' | 'partial' | 'all'
  recurrence: 'recurring' | 'once' | 'all'
  priority: [number, number]
  points: {
    range: [number, number]
    buckets: BucketState
  }
  // date: {
  //   type: 'scheduled' | 'deadline'
  //   range: [DateTime?, DateTime?]
  // }
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
  mapStateToFilters: (state: T) => FilterWithCompletions[]
  emptyState: T
}

const filterWidgets: {
  [key in keyof FilterState]: FilterWidget<key>
} = {
  search: {
    component: ({ theme, state, onChangeState }) => {
      const ref = React.useRef(null)
      return (
        <Row>
          <Icon name="search" />
          <TextInput
            ref={ref}
            autoFocus
            placeholder="Search..."
            style={{ flex: 1, height: theme.sizes.buttonHeight }}
            value={state}
            onChangeText={onChangeState}
          />
          {!!state && (
            <IconButton
              name="delete"
              size="regular"
              onPress={() => {
                onChangeState('')
                // @ts-ignore
                ref.current.focus()
              }}
            />
          )}
        </Row>
      )
    },
    mapStateToFilters: query => [task => task.settings.name.includes(query)],
    emptyState: '',
  },
  tags: {
    component: ({ state, onChangeState }) => (
      <Row>
        <Icon name="tag" />
        <SpacedList spacing="s" style={{ flex: 1 }}>
          <TagPicker
            icon="plus"
            value={state.include}
            onChange={include => onChangeState({ ...state, include })}
            excludeTags={state.exclude}
            placeholderText="Include tags..."
          />
          <TagPicker
            icon="minus"
            value={state.exclude}
            onChange={exclude => onChangeState({ ...state, exclude })}
            excludeTags={state.include}
            placeholderText="Exclude tags..."
          />
        </SpacedList>
      </Row>
    ),
    mapStateToFilters: ({ include, exclude }) => [
      task => include.every(id => task.tagIds.includes(id)),
      task => exclude.every(id => !task.tagIds.includes(id)),
    ],
    emptyState: { include: [], exclude: [] },
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
            { label: 'In progress', value: 'partial' },
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
        partial: [isInProgress],
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
  priority: {
    component: ({ state, onChangeState }) => (
      <Row spacing="s">
        <Icon name="flag" />
        <Picker
          options={priorityOptions.filter(({ value }) => value <= state[1])}
          selectedValue={state[0]}
          onValueChange={value => onChangeState([value, state[1]])}
        />
        <Text>–</Text>
        <Picker
          options={priorityOptions.filter(({ value }) => value >= state[0])}
          selectedValue={state[1]}
          onValueChange={value => onChangeState([state[0], value])}
        />
      </Row>
    ),
    mapStateToFilters: range => [
      task =>
        task.settings.priority >= range[0] &&
        task.settings.priority <= range[1],
    ],
    emptyState: [-2, 2],
  },
  points: {
    component: ({ state, onChangeState }) => (
      <Row spacing="s">
        <Icon name="star" style={{ flex: 0 }} />
        <Row style={{ flex: 2 }}>
          <NumberInput
            style={{ flex: 1 }}
            value={state.range[0]}
            onChangeText={value => {
              onChangeState({
                ...state,
                range: [value, Math.max(value, state.range[1])],
              })
            }}
            maxValue={state.range[1]}
          />
          <Text>–</Text>
          <NumberInput
            style={{ flex: 1 }}
            value={state.range[1]}
            minValue={state.range[0]}
            onChangeText={value =>
              onChangeState({
                ...state,
                range: [Math.min(value, state.range[0]), value],
              })
            }
          />
        </Row>
        <Spacer size="l" />
        <Row>
          <IconButton
            name="archive"
            variant={state.buckets === 'only' ? 'primary' : 'default'}
            color={state.buckets === 'exclude' ? 'text' : 'accent'}
            onPress={() =>
              onChangeState({
                ...state,
                buckets: nextBucketState[state.buckets],
              })
            }
          />
          <Switch
            value={state.buckets !== 'exclude'}
            onValueChange={value =>
              onChangeState({
                ...state,
                buckets: value ? 'include' : 'exclude',
              })
            }
          />
        </Row>
      </Row>
    ),
    mapStateToFilters: state => [
      task => {
        switch (state.buckets) {
          case 'exclude':
            return 'points' in task.settings
          case 'only':
            return !('points' in task.settings)
          default:
            return true
        }
      },
      task =>
        !('points' in task.settings) ||
        task.settings.points >= (state.range[0] ?? -Infinity),
      task =>
        !('points' in task.settings) ||
        task.settings.points <= (state.range[1] ?? Infinity),
    ],
    emptyState: { range: [1, 50], buckets: 'include' },
  },
  // date: {
  //   component: ({ theme, state, onChangeState }) => (
  //     <Row>
  //       <Icon name="repeat" />
  //       <DateTimeInput
  //         clearable
  //         icon={state.type === 'deadline' ? 'alert-circle' : 'calendar'}
  //         value={state.range[0]}
  //         onChange={value =>
  //           onChangeState({ ...state, range: [value, state.range[1]] })
  //         }
  //       />
  //       <DateTimeInput
  //         clearable
  //         icon={state.type === 'deadline' ? 'alert-circle' : 'calendar'}
  //         value={state.range[1]}
  //         onChange={value =>
  //           onChangeState({ ...state, range: [state.range[0], value] })
  //         }
  //       />
  //     </Row>
  //   ),
  //   mapStateToFilters: state => [],
  //   emptyState: { type: 'scheduled', range: [] },
  // },
}

const filterIcons: { icon: string; key: keyof FilterState }[] = [
  { key: 'search', icon: 'search' },
  { key: 'completion', icon: 'check-circle' },
  { key: 'points', icon: 'star' },
  { key: 'recurrence', icon: 'repeat' },
  { key: 'tags', icon: 'tag' },
  { key: 'priority', icon: 'flag' },
  // { key: 'date', icon: 'calendar' },
]

const filterIsActive = (state: FilterState, key: keyof FilterState): boolean =>
  !isEqual(state[key], filterWidgets[key].emptyState)

const getFilterWidget = (key: keyof FilterState) =>
  filterWidgets[key] as FilterWidget<typeof key>

type FilterControlsProps = {
  // filters: FilterState
  onChangeFilters: (filters: FilterWithCompletions[]) => void
}
const FilterControls = ({ onChangeFilters }: FilterControlsProps) => {
  const theme = useTheme()
  const { isSet: isOpen, toggle } = useFlags<keyof FilterState>({
    search: true,
  })

  const { form, setField } = useForm<FilterState>(
    mapValues(filterWidgets, x => x.emptyState) as FilterState
  )

  useEffect(() => {
    const filters = filterIcons.flatMap(({ key }) =>
      getFilterWidget(key).mapStateToFilters(form[key])
    )
    onChangeFilters(filters)
  }, [form])

  const renderFilterComponents = () =>
    filterIcons.map(({ key }) => {
      if (!isOpen(key)) return null
      const FilterComponent = getFilterWidget(key).component
      return (
        <View
          key={key + JSON.stringify(form[key])}
          style={{
            minHeight: theme.sizes.buttonHeight,
            justifyContent: 'center',
          }}>
          <FilterComponent
            theme={theme}
            state={form[key]}
            onChangeState={setField(key)}
          />
        </View>
      )
    })

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
          <Row style={{ flex: 1, justifyContent: 'space-evenly' }}>
            {filterIcons.map(({ key, icon }) => (
              <FilterButton
                key={key}
                isSelected={isOpen(key)}
                isActive={filterIsActive(form, key)}
                name={icon}
                onPress={() => toggle(key)}
                onLongPress={() => {
                  setField(key)(getFilterWidget(key).emptyState)
                }}
              />
            ))}
          </Row>
        </Row>
        {renderFilterComponents()}
      </SpacedList>
    </Section>
  )
}
export default FilterControls
