import React from 'react'
import { get } from 'lodash'
import { useTheme } from '@emotion/react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Octicon from 'react-native-vector-icons/Octicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Theme } from '../theme'
import { variants } from './utils'

const octicons = ['stopwatch', 'pin', 'graph', 'grabber']
const materialIcons = ['add-alarm']

type FeatherIconProps = React.ComponentProps<typeof FeatherIcon>
export type IconProps = Omit<FeatherIconProps, 'size'> & {
  // ideally we'd limit `color` to theme colors, but react-navigation
  // passes in arbitrary color strings, so we have to support them
  color?: keyof Theme['colors'] | string
  size?: keyof Theme['iconSizes'] | number
}
const BaseIcon = ({
  color = 'text',
  size = 'regular',
  name,
  onPress,
  ...props
}: IconProps) => {
  const theme = useTheme()
  const themeSize =
    typeof size === 'string' ? get(theme.iconSizes, size, 20) : size
  // get the theme color if there is one, else treat it as a plain color string
  const themeColor = get(theme.colors, color, color)
  const Component = materialIcons.includes(name)
    ? MaterialIcon
    : name.startsWith('sort') || octicons.includes(name)
    ? Octicon
    : FeatherIcon
  return (
    <Component size={themeSize} color={themeColor} name={name} {...props} />
  )
}

export const SmallIcon = (props: IconProps) => (
  <BaseIcon color="text" size="small" {...props} />
)

export const HeaderIcon = ({ style, ...props }: IconProps) => {
  const theme = useTheme()
  return (
    <BaseIcon
      size="header"
      color="accent"
      style={[{ padding: theme.spacing.s }, style]}
      {...props}
    />
  )
}

export const Icon = variants({
  default: BaseIcon,
  header: HeaderIcon,
  small: SmallIcon,
})
export default Icon
