import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import { useSelector } from '../hooks'
import { getFilters } from '../redux/selectors'
import { FilterID, Filter } from '../types'
import { useTheme } from '@emotion/react'
import { Divider } from '.'

const DrawerFilters = (props: DrawerContentComponentProps) => {
  const filters = useSelector(getFilters) as { [id: FilterID]: Filter }
  const theme = useTheme()

  return (
    <DrawerContentScrollView {...props}>
      {Object.values(filters).map(filter => (
        <DrawerItem
          key={filter.id}
          label={filter.name}
          labelStyle={{ paddingLeft: theme.spacing.m, marginVertical: -theme.spacing.xs }}
          onPress={() =>
            props.navigation.navigate('multiTaskView', { filterId: filter.id })
          }
        />
      ))}
      <Divider />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

export default DrawerFilters
