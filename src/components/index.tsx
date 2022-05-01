import React from 'react'
import { TextInputProps, StyleProp, ViewStyle } from 'react-native'
import styled, { css } from '@emotion/native'
import { get } from 'lodash'
import { useTheme } from '@emotion/react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Picker as BasePicker, PickerProps } from '@react-native-picker/picker'
import { Theme } from '../theme'

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

const inputStyle = ({ theme }: { theme: Theme }) => ({
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.underline,
  paddingBottom: 2,
  fontSize: 16,
  marginTop: -8,
  paddingHorizontal: 8,
  height: 46,
  color: theme.colors.primaryText,
})

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
    {...props} />
  )
}

const PickerContainer = styled.View([
  inputStyle,
  { paddingLeft: 0, paddingBottom: 0 },
])

export const Picker = <T extends number | string>({
  containerStyle,
  style,
  options,
  onValueChange,
  ...props
}: PickerProps<T> & {
  containerStyle?: StyleProp<ViewStyle>
  options: { label: string; value: T }[]
}) => {
  const theme = useTheme()
  return (
    <PickerContainer style={[{ flex: 1 }, containerStyle]}>
      <BasePicker<T>
        dropdownIconColor={theme.colors.text}
        style={[{ marginLeft: -8, color: theme.colors.primaryText }, style]}
        onValueChange={onValueChange}
        {...props}>
        {options.map(({ label, value }, i) => (
          <BasePicker.Item key={i} {...{ label, value }} />
        ))}
      </BasePicker>
    </PickerContainer>
  )
}

export const Picker2 = <T extends number | string>({
  containerStyle,
  style,
  ...props
}: PickerProps<T> & {
  containerStyle?: StyleProp<ViewStyle>
}) => (
  <PickerContainer style={[{ flex: 1 }, containerStyle]}>
    <BasePicker<T> {...props} />
  </PickerContainer>
)

export const Card = styled.View(({ theme: { spacing, colors } }) => ({
  marginHorizontal: spacing.m,
  marginTop: spacing.s,
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
  ...props
}: IconProps) => <Icon {...{ color, size, ...props }} />
