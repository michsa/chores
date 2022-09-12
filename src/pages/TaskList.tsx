import React, { useLayoutEffect, useState } from 'react'
import { useTheme } from '@emotion/react'

import { IconButton, Row, Button } from '../components'
import FilterControls from '../components/FilterControls'
import FilteredTasks from '../components/FilteredTasks'
import { ScreenProps, FilterWithCompletions } from '../types'

const TaskList = ({ navigation }: ScreenProps['taskList']) => {
  const [filters, setFilters] = useState<FilterWithCompletions[]>([])
  const theme = useTheme()

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
            onPress={() => navigation.navigate('addTask')}
          />
        </Row>
      ),
      title: `Tasks`,
    })
  }, [navigation])

  const ref = React.useRef(null)

  return (
    <React.Fragment>
      <FilterControls onChangeFilters={setFilters} />
      <FilteredTasks filters={filters} />
    </React.Fragment>
  )
}

export default TaskList
