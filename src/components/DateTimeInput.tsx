import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '@emotion/react'

import { useForm } from '../hooks'
import { DateTime } from '../types'
import { Icon, IconButton, Text, FakeInputText, Row } from '../components'
import { toDate, formatDate, formatTime, parseValue } from '../utils'

type PickerState = 'date' | 'time' | null

type ClearableProps = {
  onChange: (dt?: DateTime) => void
  clearable: true
}
type NonClearableProps = {
  onChange: (dt: DateTime) => void
  clearable?: false
}
type DateTimeInputProps = {
  value: DateTime
  icon: string
  startOpen?: boolean
  minimumDate?: Date
  maximumDate?: Date
} & (ClearableProps | NonClearableProps)

export const DateTimeInput = (props: DateTimeInputProps) => {
  // discriminated union types don't work with destructuring :(
  const { value, icon, startOpen, minimumDate, maximumDate } = props
  const theme = useTheme()
  const { form, setField } = useForm<DateTime>(value)
  const [picker, setPicker] = useState<PickerState>(startOpen ? 'date' : null)

  useEffect(() => props.onChange(form), [form])

  return (
    <Row spacing="xs">
      <Row style={{ flex: 3 }}>
        <Icon name={icon} />
        <FakeInputText style={{ flex: 1 }} onPress={() => setPicker('date')}>
          {formatDate(form)}
        </FakeInputText>
      </Row>
      <Text>
        {!!picker && (
          <DateTimePicker
            mode={picker}
            {...{ minimumDate, maximumDate }}
            value={toDate(form) ?? new Date()}
            onChange={(e, date) => {
              const field = picker
              setPicker(null)
              if (date && e.type === 'set') {
                const formatted = parseValue(field, date)
                console.log(formatted)
                setField(field)(formatted)
              }
            }}
          />
        )}
      </Text>
      <Row style={{ flex: 2 }}>
        <Icon name="clock" color={form.time ? undefined : 'placeholderText'} />
        <FakeInputText
          style={{
            color: form.time
              ? theme.colors.primaryText
              : theme.colors.placeholderText,
            flex: 1,
          }}
          onPress={() => setPicker('time')}
          onLongPress={() => setField('time')(undefined)}>
          {formatTime(form) ?? 'Time'}
        </FakeInputText>
      </Row>
      {props.clearable && (
        <IconButton
          name="x"
          size="regular"
          onPress={() => props.onChange(undefined)}
          containerStyle={{ marginRight: -theme.spacing.xs }}
        />
      )}
    </Row>
  )
}
export default DateTimeInput
