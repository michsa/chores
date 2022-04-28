import { clamp } from 'ramda'
import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

const NumericTextInput = ({
  value,
  onChangeText,
  minValue,
  maxValue,
  ...props
}: {
  value: number
  minValue?: number
  maxValue?: number
  onChangeText: (value: number) => void
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType'>) => (
  <TextInput
    selectTextOnFocus
    keyboardType="numeric"
    value={value.toString()}
    onChangeText={(text: string) => {
      const numericTextValue = text.replace(/[^0-9]/g, '') || '0'
      const newNumValue = parseInt(numericTextValue, 10)
      onChangeText(clamp(minValue ?? 0, maxValue ?? Infinity, newNumValue))
    }}
    {...props}
  />
)
export default NumericTextInput
