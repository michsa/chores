import React, { useEffect } from 'react'
import { View, ViewStyle } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Frequency, Recurrence } from '../types'
import { useForm } from '../hooks'
import { inputStyle } from '../styles'
import { frequencyOptions, maybePlural } from '../utils'
import NumericTextInput from './NumericTextInput'

const EditRecurrence = ({
  value = { frequency: Frequency.WEEK, interval: 1 },
  style = {},
  onChange,
}: {
  value?: Recurrence
  style?: ViewStyle
  onChange: (r: Recurrence) => void
}) => {
  const { form, setField } = useForm<Recurrence>(value)

  useEffect(() => {
    onChange(form)
  }, [form])
  return (
    <View
      style={{ ...style, minWidth: 200, flexDirection: 'row', justifyContent: 'space-around', flex: 1 }}>
      <NumericTextInput
        style={{
          ...inputStyle,
          flex: 1,
          paddingBottom: 2,
        }}
        value={form.interval}
        minValue={1}
        onChangeText={setField('interval')}
      />
      <View
        style={{
          ...inputStyle,
          flex: 3,
          padding: 0,
          margin: 0,
          marginLeft: 8,
        }}>
        <Picker
          selectedValue={form.frequency}
          onValueChange={setField('frequency')}>
          {frequencyOptions.map(({ label, value }) => (
            <Picker.Item
              key={value}
              label={maybePlural(label, form.interval)}
              value={value}
            />
          ))}
        </Picker>
      </View>
    </View>
  )
}

export default EditRecurrence
