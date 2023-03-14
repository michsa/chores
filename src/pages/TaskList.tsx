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
import { ScreenProps } from '../types'
import { defaultConfigs } from '../utils'

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
  const [filterConfig, setFilterConfig] =
    useState<keyof typeof defaultConfigs>('allTasks')

  const [query, setQuery] = useState<string>('')

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
            selectedValue={filterConfig}
            onValueChange={setFilterConfig}
            options={Object.keys(defaultConfigs).map(key => ({
              label: startCase(key),
              value: key,
            }))}
          />
        </Row>
        <SearchBar value={query} onChange={setQuery} />
      </SpacedList>

      <Divider style={{ marginBottom: 0 }} />
      <FilteredTasks
        filterConfig={defaultConfigs[filterConfig]}
        query={query}
      />
    </React.Fragment>
  )
}

export default TaskList
