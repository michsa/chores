import React from 'react'
import styled, { ReactNativeStyle } from '@emotion/native'
import { useTheme } from '@emotion/react'
import { Picker as BasePicker, PickerProps } from '@react-native-picker/picker'
import { inputStyle } from '../styles'

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
  containerStyle?: ReactNativeStyle
  options: { label: string; value: T }[]
}) => {
  const theme = useTheme()
  return (
    <PickerContainer style={[{ flex: 1 }, containerStyle]}>
      <BasePicker<T>
        dropdownIconColor={theme.colors.text}
        style={[
          {
            marginLeft: -theme.spacing.s,
            marginRight: -theme.spacing.l,
            color: theme.colors.primaryText,
          },
          style,
        ]}
        onValueChange={onValueChange}
        {...props}>
        {options.map(({ label, value }, i) => (
          <BasePicker.Item key={i} {...{ label, value }} />
        ))}
      </BasePicker>
    </PickerContainer>
  )
}
