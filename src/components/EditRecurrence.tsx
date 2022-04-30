import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Frequency, Recurrence } from '../types'
import { useForm } from '../hooks'
import { inputStyle } from '../styles'
import { frequencies } from '../utils'
import NumericTextInput from './NumericTextInput'

const maybePlural = (text: string, qty: number) =>
  qty === 1 ? text : `${text}s`

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
  return (
    <View
      style={{ ...style, flexDirection: 'row', justifyContent: 'flex-start' }}>
      <NumericTextInput
        style={{
          ...inputStyle,
          flexBasis: 50,
          flexShrink: 0,
          flexGrow: 1,
          paddingBottom: 2,
          marginTop: 0,
        }}
        value={form.interval}
        minValue={1}
        onChangeText={setField('interval')}
      />
      <View
        style={{
          ...inputStyle,
          flexBasis: 150,
          flexShrink: 0,
          flexGrow: 3,
          padding: 0,
          margin: 0,
          marginLeft: 8,
        }}>
        <Picker
          selectedValue={form.frequency}
          onValueChange={(value: Frequency) => {
            setField('frequency')(value)
            onChange(form)
          }}>
          {Object.entries(frequencies).map(([key, value]) => (
            <Picker.Item
              key={value}
              label={maybePlural(key, form.interval)}
              value={value}
            />
          ))}
        </Picker>
      </View>
    </View>
  )
}

export default EditRecurrence
