import React from 'react'
import { Pressable, Keyboard } from 'react-native'
import { useTheme } from '@emotion/react'
import { readableText } from '../utils'
import { ButtonProps } from './Button'
import Icon, { IconProps } from './Icon'

type IconButtonProps = IconProps & {
  containerProps?: Omit<ButtonProps, 'onPress'>
  variant?: 'default' | 'primary'
}
export const IconButton = ({
  onPress,
  color = 'accent',
  containerProps: { style, ...containerProps } = {},
  variant = 'default',
  ...props
}: IconButtonProps) => {
  const theme = useTheme()
  const backgroundColor = (pressed: boolean) => {
    if (variant === 'primary') return theme.colors[color]
    return pressed ? theme.colors.underline : 'transparent'
  }
  return (
    <Pressable
      removeClippedSubviews
      style={({ pressed }) => [
        {
          borderRadius: theme.spacing.xl,
          backgroundColor: backgroundColor(pressed),
          padding: theme.spacing.s,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      onPress={(e: any) => {
        Keyboard.dismiss()
        onPress?.(e)
      }}
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
