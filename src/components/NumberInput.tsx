import { clamp } from 'lodash'
import React, { useState, useEffect } from 'react'
import { TextInputProps } from 'react-native'
import { TextInput } from '.'

const useNumericValue = (value?: number | string) => {
  const [strValue, setStrValue] = useState(value?.toString() ?? '')
  const setValue = (value: string | number) => setStrValue(value.toString())

  const n = parseInt(strValue, 10)
  return { setValue, strValue, numValue: isNaN(n) ? 0 : n }
}

/**
 * Text input for manipulating a number value.
 * Supports an undefined value while editing or as part of initial state -
 * if the current value is not a number, 0 is passed to `onChangeText`.
 *
 * When the user ends editing (taps outside the component), the current value
 * is clamped to `minValue` and `maxValue`. Waiting until `onEndEditing` to
 * clamp the value allows the user to completely clear the text while editing.
 *
 * The downside is that pressing buttons with `keyboardShouldPersistTaps`
 * enabled does not blur the NumberInput so `onEndEditing` does not get called,
 * which means it's possible to act on the input's value before it's clamped.
 * We can get around this by manually calling `Keyboard.dismiss()` in the press
 * handler on all our important buttons, which triggers `onEndEditing`.
 */
const NumberInput = ({
  value,
  onChangeText,
  minValue = 0,
  maxValue = Infinity,
  ...props
}: {
  value?: number
  minValue?: number
  maxValue?: number
  onChangeText: (value: number) => void
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType'>) => {
  const { strValue, numValue, setValue } = useNumericValue(value)

  useEffect(() => onChangeText(numValue), [strValue])

  return (
    <TextInput
      selectTextOnFocus
      blurOnSubmit
      keyboardType="numeric"
      value={strValue}
      onChangeText={text => setValue(text.replace(/[^0-9^\-]/g, ''))}
      onEndEditing={() => setValue(clamp(numValue, minValue, maxValue))}
      {...props}
    />
  )
}
export default NumberInput
