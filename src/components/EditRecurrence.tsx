import React, { useEffect } from 'react'
import { View, ViewStyle } from 'react-native'
import { Picker } from '../components'
import { Frequency, Recurrence } from '../types'
import { useForm } from '../hooks'
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
      style={{
        ...style,
        minWidth: 200,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      <NumericTextInput
        style={{ flex: 1 }}
        value={form.interval}
        minValue={1}
        onChangeText={setField('interval')}
      />
      <Picker
        containerStyle={{ flex: 3, marginLeft: 8 }}
        selectedValue={form.frequency}
        onValueChange={setField('frequency')}
        options={frequencyOptions.map(option => ({
          ...option,
          label: maybePlural(option.label, form.interval),
        }))}
      />
    </View>
  )
}

export default EditRecurrence
