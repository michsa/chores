import React, { useState, useEffect } from 'react'
import { Modal } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '@emotion/react'
import {
  differenceInWeeks,
  format,
  formatISO,
  isSameYear,
  isToday,
  isTomorrow,
} from 'date-fns'

import { useForm } from '../hooks'
import { DateTime } from '../types'
import { Icon, IconButton, Text, FakeInputText, Row } from '../components'
import { toDate } from '../utils'

export const formatValue = (
  type: 'date' | 'time',
  date: Date
): DateTime[typeof type] =>
  type === 'date'
    ? [date.getFullYear(), date.getMonth(), date.getDate()]
    : [date.getHours(), date.getMinutes()]

const formatDate = (dt: DateTime) => {
  const date = toDate(dt)
  const now = new Date()
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  const weekDiff = differenceInWeeks(date, now)
  if (weekDiff < 2) {
    const weekStr = weekDiff === 1 ? 'Next ' : ''
    return weekStr + format(date, 'EEEE')
  }
  return format(date, 'EEE, MMM dd' + (isSameYear(now, date) ? '' : ' yyyy'))
}

const formatTime = (dt: DateTime) =>
  dt.time ? format(toDate(dt), 'h:mm a') : undefined

type PickerState = 'date' | 'time' | null

export const DateTimeInput = ({
  value,
  onChange,
  icon,
  startOpen = true,
}: {
  value: DateTime
  onChange: (dt?: DateTime) => void
  icon: string
  startOpen?: boolean
}) => {
  const theme = useTheme()
  const { form, setField } = useForm<DateTime>(value)
  const [picker, setPicker] = useState<PickerState>(startOpen ? 'date' : null)
  useEffect(() => onChange(form), [form])
  return (
    <Row>
      <Row style={{ flex: 1 }}>
        <Icon name={icon} />
        <FakeInputText style={{ flex: 2 }} onPress={() => setPicker('date')}>
          {formatDate(form)}
        </FakeInputText>
        {!!picker && (
          <DateTimePicker
            style={{ width: 0 }}
            mode={picker}
            minimumDate={new Date()}
            value={toDate(form) ?? new Date()}
            onChange={(e, date) => {
              if (date && e.type === 'set') {
                const formatted = formatValue(picker, date)
                console.log(formatted)
                setField(picker)(formatted)
              }
              setPicker(null)
            }}
          />
        )}
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
      <IconButton
        name="x"
        onPress={() => onChange(undefined)}
        containerProps={{ style: { marginRight: -theme.spacing.xs } }}
      />
    </Row>
  )
}
export default DateTimeInput
