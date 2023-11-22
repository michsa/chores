import { version } from '../../package.json'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import styled from '@emotion/native'
import { useSelector } from '../hooks'
import { getFilters } from '../redux/selectors'
import { FilterID, Filter } from '../types'
import { useTheme } from '@emotion/react'
import { Divider, Icon, Text, Card, Row, SpacedList } from '.'

// react-navigation/drawer hardcodes a 32px margin-right on the icon container
const DrawerIcon = styled(Icon)(({ theme }) => ({
  marginRight: -32 + theme.spacing.l,
}))

// shorthand to render a consistent icon with a particular name.
// also used in the drawer screens defined in App.tsx.
export const renderDrawerIcon =
  (name: string) =>
  ({ focused, color }: { focused: boolean; color: string }) =>
    <DrawerIcon {...{ name, focused, color }} />

const DrawerFilters = (props: DrawerContentComponentProps) => {
  const filters = useSelector(getFilters) as { [id: FilterID]: Filter }
  const theme = useTheme()

  return (
    <DrawerContentScrollView {...props}>
      <Row
        style={{
          margin: theme.spacing.m,
          marginTop: theme.spacing.l,
          marginBottom: theme.spacing.s,
          alignItems: 'center',
        }}
        spacing="m">
        <Icon
          name="check-circle"
          size="xxlarge"
          color="primaryText"
          style={{
            backgroundColor: theme.colors.accent,
            padding: theme.spacing.s,
            borderRadius: theme.spacing.s,
          }}
        />
        <SpacedList spacing="xxs">
          <Text variant="primary" size="large">
            chores
          </Text>
          <Text size="small">v. {version}</Text>
        </SpacedList>
      </Row>
      <Divider size="s" />
      <DrawerItem
        label="Add Task"
        icon={renderDrawerIcon('plus')}
        labelStyle={{
          fontSize: theme.fontSizes.regular,
          marginVertical: -theme.spacing.xs,
        }}
        onPress={() => props.navigation.navigate('editTask')}
      />
      <Divider size="s" />
      <DrawerItem
        label="Tasks"
        focused={props.state.index == 0}
        icon={renderDrawerIcon('check-circle')}
        labelStyle={{ fontSize: theme.fontSizes.regular }}
        onPress={() => props.navigation.navigate('multiTaskView')}
      />
      {Object.values(filters).map(filter => (
        <DrawerItem
          key={filter.id}
          label={filter.name}
          labelStyle={{ marginVertical: -theme.spacing.xs }}
          // use the same icon as Tasks above to ensure the same spacing,
          // but make it invisible
          icon={() => <DrawerIcon name={'check-circle'} color="transparent" />}
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
