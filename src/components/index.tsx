import React from 'react'
import { TextInputProps } from 'react-native'
import styled from '@emotion/native'
import { get } from 'lodash'
import { useTheme } from '@emotion/react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Theme } from '../theme'
import { inputStyle } from '../styles'

export * from './Picker'

export const Text = styled.Text(({ theme }) => ({
  color: theme.colors.text,
}))
export const PrimaryText = styled(Text)(({ theme }) => ({
  color: theme.colors.primaryText,
  fontSize: 16,
}))
export const PropertyText = styled(PrimaryText)(({ theme }) => ({
  paddingVertical: theme.spacing.s,
}))

export const FakeInputText = styled.Text([
  inputStyle,
  {
    paddingBottom: 8,
    paddingTop: 16,
    fontSize: 16,
  },
])

const BaseTextInput = styled.TextInput(inputStyle)

export const TextInput = (props: TextInputProps) => {
  const theme = useTheme()
  return (
    <BaseTextInput
      placeholderTextColor={theme.colors.placeholderText}
      {...props}
    />
  )
}

export const Section = styled.View(({ theme }) => ({
  marginHorizontal: theme.spacing.m,
  marginTop: theme.spacing.s,
}))

export const Card = styled(Section)(({ theme: { spacing, colors } }) => ({
  backgroundColor: colors.foreground,
  paddingHorizontal: spacing.l,
  paddingVertical: spacing.s,
  borderRadius: 8,
}))

type FeatherIconProps = React.ComponentProps<typeof FeatherIcon>
type IconProps = Omit<FeatherIconProps, 'size'> & {
  color?: keyof Theme['colors']
  size?: FeatherIconProps['size'] | keyof Theme['spacing']
}
export const Icon = ({ color = 'text', size = 20, ...props }: IconProps) => {
  const theme = useTheme()
  const themeSize = get(theme.spacing, 'size', size)
  const themeColor = theme.colors[color]
  return <FeatherIcon size={themeSize} color={themeColor} {...props} />
}

export const HeaderIcon = ({
  color = 'accent',
  size = 24,
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

export const Divider = styled.View<{ size?: keyof Theme['spacing'] }>(
  ({ size = 's', theme }) => ({
    flex: 0,
    flexBasis: theme.spacing[size],
    minWidth: theme.spacing[size],
    minHeight: theme.spacing[size],
  })
)
