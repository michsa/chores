import React, { useLayoutEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
import { startCase } from 'lodash'

import { IconButton, Row, Button, SpacedList } from '../components'
import FilteredTasks from '../components/FilteredTasks'
import { Picker } from '../components'
import { ScreenProps } from '../types'
import { defaultConfigs } from '../utils'

const TaskList = ({ navigation }: ScreenProps['taskList']) => {
  const theme = useTheme()
  const [filterConfig, setFilterConfig] =
    useState<keyof typeof defaultConfigs>('allTasks')

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
    <SpacedList style={{ paddingHorizontal: theme.spacing.s }}>
      <Picker
        selectedValue={filterConfig}
        onValueChange={setFilterConfig}
        containerStyle={{ flexGrow: 0 }}
        options={Object.keys(defaultConfigs).map(key => ({
          label: startCase(key),
          value: key,
        }))}
      />
      <FilteredTasks filterConfig={defaultConfigs[filterConfig]} />
    </SpacedList>
  )
}

export default TaskList
