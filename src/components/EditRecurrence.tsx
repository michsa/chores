import React, { useEffect } from 'react'
import { View, ViewStyle } from 'react-native'
import { Picker } from '../components'
import { Frequency, Interval } from '../types'
import { useForm } from '../hooks'
import { frequencyOptions, maybePlural } from '../utils'
import NumberInput from './NumberInput'

const EditRecurrence = ({
  value = { frequency: Frequency.WEEK, count: 1 },
  style = {},
  onChange,
}: {
  value?: Interval
  style?: ViewStyle
  onChange: (r: Interval) => void
}) => {
  const { form, setField } = useForm<Interval>(value)

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
      <NumberInput
        style={{ flex: 1 }}
        value={form.count}
        minValue={1}
        onChangeText={setField('count')}
      />
      <Picker
        containerStyle={{ flexGrow: 3, marginLeft: 8 }}
        selectedValue={form.frequency}
        onValueChange={setField('frequency')}
        options={frequencyOptions.map(option => ({
          ...option,
          label: maybePlural(option.label, form.count),
        }))}
      />
    </View>
  )
}

export default EditRecurrence
