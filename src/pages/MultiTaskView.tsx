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

  const selectedFilter = route.params?.filterId

  // const [selectedFilter, setSelectedFilter] = useState<FilterID>(
  //   route.params?.filterId
  // )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: filters[selectedFilter]?.name ?? 'Tasks',
    })
  }, [navigation, selectedFilter])

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

      <BottomTabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: { marginLeft: theme.spacing.xl },
          // tabBarShowLabel: false
        }}>
        <BottomTabs.Screen
          name="taskList"
          component={TaskList}
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <Icon name="check-circle" {...{ color, size }} />
            ),
          }}
        />
        <BottomTabs.Screen
          name="multiTaskMetrics"
          component={MultiTaskMetrics}
          options={{
            title: 'Metrics',
            tabBarIcon: ({ color, size }) => (
              <Icon name="graph" {...{ color, size }} />
            ),
          }}
        />
      </BottomTabs.Navigator>
    </FilterContext.Provider>
  )
}

export default MultiTaskView
