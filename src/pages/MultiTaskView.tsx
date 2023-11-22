import React, { useLayoutEffect, useState, createContext } from 'react'
import { useTheme } from '@emotion/react'
import { startCase } from 'lodash'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Row, Card, SpacedList, Icon, Spacer } from '../components'
import TaskList from './TaskList'
import MultiTaskMetrics from './MultiTaskMetrics'
import { Picker } from '../components'
import { useSelector } from '../hooks'
import { getFilters } from '../redux/selectors'
import { ScreenProps, FilterID, MultiTaskViewParams, Filter } from '../types'

const BottomTabs = createBottomTabNavigator<MultiTaskViewParams>()

export const FilterContext = createContext<Filter>({
  name: 'default filter',
  id: `filter-${Date.now()}`,
  configs: [],
})

const MultiTaskView = ({ route, navigation }: ScreenProps['multiTaskView']) => {
  const theme = useTheme()
  const filters = useSelector(getFilters) as { [k: FilterID]: Filter }

  console.log(route.params?.filterId)
  const selectedFilter = route.params?.filterId

  // const [selectedFilter, setSelectedFilter] = useState<FilterID>(
  //   route.params?.filterId
  // )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: ['Tasks', startCase(filters[selectedFilter]?.name)].join(': '),
    })
  }, [navigation, selectedFilter])

  console.log({ selectedFilter })

  return (
    <FilterContext.Provider value={filters[selectedFilter]}>
      {/* <SpacedList style={{ paddingHorizontal: theme.spacing.xs }}>
        <Row as={Card}>
          <Icon name="filter" />
          <Picker
            selectedValue={selectedFilter}
            onValueChange={setSelectedFilter}
            options={Object.values(filters).map(filter => ({
              label: startCase(filter.name),
              value: filter.id,
            }))}
          />
        </Row>
      </SpacedList> 

      <Spacer />*/}

      <BottomTabs.Navigator screenOptions={{ headerShown: false }}>
        <BottomTabs.Screen name="taskList" component={TaskList} />
        <BottomTabs.Screen
          name="multiTaskMetrics"
          component={MultiTaskMetrics}
        />
      </BottomTabs.Navigator>
    </FilterContext.Provider>
  )
}

export default MultiTaskView
