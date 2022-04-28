import React from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Frequency, Recurrence } from '../types'
import { useForm } from '../hooks'
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
          flexBasis: 50,
          flexShrink: 0,
          flexGrow: 1,
          borderBottomWidth: 1,
          borderBottomColor: 'lightgrey',
          paddingBottom: 2,
          fontSize: 16,
          // paddingTop: 0,
          marginTop: 0,
          // borderWidth: 1,
          borderColor: '#F0F'
        }}
        value={form.interval}
        minValue={1}
        onChangeText={setField('interval')}
      />
      <View
        style={{
          flexBasis: 150,
          flexShrink: 0,
          flexGrow: 3,
          padding: 0,
          margin: 0,
          height: 46,
          borderBottomWidth: 1,
          borderBottomColor: 'lightgrey',
          marginLeft: 8,
          // borderWidth: 1,
          borderColor: '#0F0'
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
