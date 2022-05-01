import { clamp } from 'lodash'
import React from 'react'
import { TextInputProps } from 'react-native'
import { TextInput } from '../components'

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
      onChangeText(clamp(newNumValue, minValue ?? 0, maxValue ?? Infinity))
    }}
    {...props}
  />
)
export default NumericTextInput
