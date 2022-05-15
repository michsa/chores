import React from 'react'
import { Pressable, Keyboard, PressableProps } from 'react-native'
import { useTheme } from '@emotion/react'
import { Theme } from '../theme'
import { readableText } from '../utils'
import { ButtonProps } from './Button'
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
    if (variant === 'primary') return theme.colors[color]
    return pressed ? theme.colors.highlight : 'transparent'
  }
  return (
    <Pressable
      disabled={disabled}
      removeClippedSubviews
      style={({ pressed }) => [
        {
          borderRadius: theme.spacing.xl,
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
