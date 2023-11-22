import React, { useContext, useState } from 'react'
import { useTheme } from '@emotion/react'

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
import { FilterContext } from './MultiTaskView'
import { ScreenProps } from '../types'

const SearchBar = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
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

const TaskList = (_: ScreenProps['taskList']) => {
  const theme = useTheme()
  const [query, setQuery] = useState<string>('')

  const filter = useContext(FilterContext)

  return (
    <React.Fragment>
      <SpacedList style={{ paddingHorizontal: theme.spacing.xs }}>
        <SearchBar value={query} onChange={setQuery} />
      </SpacedList>

      <Divider style={{ marginBottom: 0 }} />
      <FilteredTasks filter={filter} query={query} />
    </React.Fragment>
  )
}

export default TaskList
