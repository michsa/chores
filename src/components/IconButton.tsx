import React from 'react'
import { Pressable, Keyboard } from 'react-native'
import { useTheme } from '@emotion/react'
import { Theme } from '../theme'
import { readableText } from '../utils'
import { ButtonProps } from './Button'
import Icon, { IconProps } from './Icon'

export type IconButtonProps = IconProps & {
  containerProps?: Omit<ButtonProps, 'onPress'>
  variant?: 'default' | 'primary'
  backgroundColor?: (pressed: boolean) => keyof Theme['colors']
}
export const IconButton = ({
  onPress,
  onLongPress,
  color = 'accent',
  backgroundColor,
  containerProps: { style, ...containerProps } = {},
  variant = 'default',
  ...props
}: IconButtonProps) => {
  const theme = useTheme()
  const defaultBackgroundColor = (pressed: boolean) => {
    if (variant === 'primary') return theme.colors[color]
    return pressed ? theme.colors.highlight : 'transparent'
  }
  return (
    <Pressable
      removeClippedSubviews
      style={({ pressed }) => [
        {
          borderRadius: theme.spacing.xl,
          backgroundColor: backgroundColor
            ? theme.colors[backgroundColor(pressed)]
            : defaultBackgroundColor(pressed),
          padding: theme.spacing.s,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      onPress={(e: any) => {
        Keyboard.dismiss()
        onPress?.(e)
      }}
      onLongPress={onLongPress}
      {...containerProps}>
      <Icon
        size="header"
        color={variant === 'primary' ? readableText(theme, color) : color}
        {...props}
      />
    </Pressable>
  )
}
export default IconButton
