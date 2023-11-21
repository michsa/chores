import React, { useLayoutEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
import { startCase } from 'lodash'

import {
  IconButton,
  Row,
  Button,
  Card,
  SpacedList,
  TextInput,
  Icon,
  Divider,
} from '../components'
import FilteredTasks from '../components/FilteredTasks'
import { Picker } from '../components'
import { useSelector } from '../hooks'
import { getFilters } from '../redux/selectors'
import { ScreenProps, FilterID } from '../types'

const SearchBar = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const theme = useTheme()
  const ref = React.useRef(null)
  return (
    <Row as={Card}>
      <Icon name="search" />
      <TextInput
        ref={ref}
        // autoFocus
        placeholder="Search..."
        style={{ flex: 1 }}
        value={value}
        onChangeText={onChange}
      />
      {!!value && (
        <IconButton
          name="delete"
          size="regular"
          color="text"
          onPress={() => {
            onChange('')
            // @ts-ignore
            ref.current.focus()
          }}
        />
      )}
    </Row>
  )
}

const TaskList = ({ navigation }: ScreenProps['taskList']) => {
  const theme = useTheme()
  const [selectedFilter, setSelectedFilter] = useState<FilterID>('all')
  const [query, setQuery] = useState<string>('')
  const filters = useSelector(getFilters)

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
            onPress={() => navigation.navigate('editTask')}
          />
        </Row>
      ),
      title: `Tasks`,
    })
  }, [navigation])

  const ref = React.useRef(null)

  return (
    <React.Fragment>
      <SpacedList style={{ paddingHorizontal: theme.spacing.xs }}>
        <Row as={Card}>
          <Icon name="list" />
          <Picker
            selectedValue={selectedFilter}
            onValueChange={setSelectedFilter}
            options={filters.map(filter => ({
              label: startCase(filter.name),
              value: filter.id,
            }))}
          />
        </Row>
        <SearchBar value={query} onChange={setQuery} />
      </SpacedList>

      <Divider style={{ marginBottom: 0 }} />
      <FilteredTasks filterId={selectedFilter} query={query} />
    </React.Fragment>
  )
}

export default TaskList
