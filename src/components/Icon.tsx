import React from 'react'
import { get } from 'lodash'
import { useTheme } from '@emotion/react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Theme } from '../theme'
import { variants } from './utils'

type FeatherIconProps = React.ComponentProps<typeof FeatherIcon>
type IconProps = Omit<FeatherIconProps, 'size'> & {
  color?: keyof Theme['colors']
  size?: keyof Theme['iconSizes'] | number
}
const BaseIcon = ({
  color = 'text',
  size = 'regular',
  ...props
}: IconProps) => {
  const theme = useTheme()
  const themeSize = typeof size === 'string' ? get(theme.iconSizes, size, 20) : size
  const themeColor = theme.colors[color]
  return <FeatherIcon size={themeSize} color={themeColor} {...props} />
}

export const SmallIcon = ({
  color = 'text',
  size = 'small',
  ...props
}: IconProps) => <BaseIcon {...props} />

export const HeaderIcon = ({
  color = 'accent',
  size = 'header',
  style,
  ...props
}: IconProps) => {
  const theme = useTheme()
  return (
    <Icon
      style={[{ padding: theme.spacing.s }, style]}
      {...{ color, size, ...props }}
    />
  )
}

export const Icon = variants({ default: BaseIcon, header: HeaderIcon, small: SmallIcon })
