import React from 'react'
import { Pressable, PressableProps, Keyboard } from 'react-native'
import { useTheme } from '@emotion/react'
import { variants } from './utils'
import { Icon, Text, Row } from '.'
import { Theme } from '../theme'
import { readableText } from '../utils'

export type ButtonProps = PressableProps & {
  title?: string
  icon?: string
  iconSize?: keyof Theme['iconSizes']
  labelSize?: keyof Theme['fontSizes']
  color?: keyof Theme['colors']
  fontColor?: keyof Theme['colors']
}
export const BaseButton = ({
  onPress,
  title,
  icon,
  iconSize,
  labelSize,
  color = 'accent',
  fontColor,
  style,
  ...props
}: ButtonProps) => {
  const theme = useTheme()
  const textColor = fontColor ?? readableText(theme, color)
  return (
    <Pressable
      style={({ pressed }) => [
        {
          minHeight: theme.sizes.buttonHeight,
          borderRadius: theme.spacing.s,
          backgroundColor: theme.colors[color],
          paddingHorizontal: theme.spacing.l,
          paddingVertical: theme.spacing.s,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      onPress={(e: any) => {
        Keyboard.dismiss()
        onPress?.(e)
      }}
      {...props}>
      <Row spacing="xs" style={{ flex: 1, justifyContent: 'center' }}>
        {icon && <Icon name={icon} color={textColor} size={iconSize} />}
        {title && (
          <Text
            style={{
              flexShrink: 1,
              textAlign: 'center',
              paddingHorizontal: theme.spacing.s,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
            color={textColor}
            size={labelSize}>
            {title}
          </Text>
        )}
      </Row>
    </Pressable>
  )
}

export const OutlineButton = ({
  style,
  color = 'accent',
  ...props
}: Omit<ButtonProps, 'fontColor'>) => {
  const theme = useTheme()
  return (
    <BaseButton
      style={({ pressed }) => [
        {
          borderWidth: 1,
          backgroundColor: pressed
            ? theme.colors.foreground
            : theme.colors.background,
          borderColor: theme.colors[color],
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      fontColor={color}
      {...props}
    />
  )
}

export const Button = variants({
  default: BaseButton,
  outline: OutlineButton,
})
export default Button
