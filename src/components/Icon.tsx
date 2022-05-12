import React from 'react'
import { get } from 'lodash'
import { useTheme } from '@emotion/react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Octicon from 'react-native-vector-icons/Octicons'
import { Theme } from '../theme'
import { variants } from './utils'

const octicons = ['filter', 'stopwatch']

type FeatherIconProps = React.ComponentProps<typeof FeatherIcon>
export type IconProps = Omit<FeatherIconProps, 'size'> & {
  color?: keyof Theme['colors']
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
  const themeColor = theme.colors[color]
  const Component =
    name.startsWith('sort') || octicons.includes(name) ? Octicon : FeatherIcon
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
