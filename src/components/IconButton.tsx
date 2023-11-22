import React from 'react'
import { get } from 'lodash'
import { Pressable, Keyboard, PressableProps } from 'react-native'
import { useTheme } from '@emotion/react'
import { Theme } from '../theme'
import { readableText } from '../utils'
import Icon, { IconProps } from './Icon'

export type IconButtonProps = IconProps & {
  containerStyle?: PressableProps['style']
  variant?: 'default' | 'primary'
  backgroundColor?: (pressed: boolean) => keyof Theme['colors']
  disabled?: boolean
}
export const IconButton = ({
  onPress,
  onLongPress,
  color = 'accent',
  backgroundColor,
  containerStyle,
  variant = 'default',
  disabled,
  ...props
}: IconButtonProps) => {
  const theme = useTheme()
  const defaultBackgroundColor = (pressed: boolean) => {
    return variant === 'primary'
      ? // if `color` is not a theme key, assume it's a plain color string.
        // we have to support arbitrary colors because of react-navigation.
        get(theme.colors, color, color)
      : pressed
      ? theme.colors.highlight
      : 'transparent'
  }
  return (
    <Pressable
      disabled={disabled}
      removeClippedSubviews
      style={({ pressed }) => [
        {
          borderRadius:
            typeof props.size == 'number'
              ? props.size
              : theme.iconSizes[props.size ?? 'regular'],
          backgroundColor: backgroundColor
            ? theme.colors[backgroundColor(pressed)]
            : defaultBackgroundColor(pressed),
          padding: theme.spacing.s,
        },
        typeof containerStyle === 'function'
          ? containerStyle({ pressed })
          : containerStyle,
      ]}
      onPress={(e: any) => {
        Keyboard.dismiss()
        onPress?.(e)
      }}
      onLongPress={onLongPress}>
      <Icon
        size="header"
        color={variant === 'primary' ? readableText(theme, color) : color}
        {...props}
      />
    </Pressable>
  )
}
export default IconButton
