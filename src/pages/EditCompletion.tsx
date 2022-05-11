import React, { useState, useLayoutEffect } from 'react'
import { Pressable, Switch, ToastAndroid } from 'react-native'
import { useTheme } from '@emotion/react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { add } from 'date-fns'

import { Card, Text, IconButton, Row, SpacedList, Icon } from '../components'
import NumberInput from '../components/NumberInput'
import { useDispatch, useSelector, useForm } from '../hooks'
import { getTask } from '../redux/selectors'
import { completeTask } from '../redux/thunks'
import { NavigationProps, CompletionInput } from '../types'

type PartialCompletionInput = Omit<CompletionInput, 'points'> & {
  points?: number
}

const validate = (form: PartialCompletionInput): CompletionInput => {
  if (!form.points) throw Error('Completion must have points')

  return form as CompletionInput
}

const CompleteTask = ({
  navigation,
  route: {
    params: { id },
  },
}: NavigationProps['completeTask']) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const task = useSelector(getTask, id)

  if (!task) return null

  const pointsRemaining = task.settings.points - (task.runningPoints ?? 0)

  const { form, setField } = useForm<PartialCompletionInput>({
    date: Date.now(),
    points: pointsRemaining,
    isFull: true,
  })

  const onSubmit = () => {
    console.log('completeTask', form)

    try {
      const formToSubmit = validate(form)
      dispatch(completeTask(formToSubmit, task.id))
      navigation.goBack()
      navigation.navigate('viewTask', { id })
    } catch (e: unknown) {
      console.log(typeof e)
      const error = (e as Error).toString()
      ToastAndroid.show(error, ToastAndroid.LONG)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          variant="primary"
          size="xlarge"
          name="check"
          onPress={onSubmit}
        />
      ),
    })
  }, [navigation, form])

  const [datePicker, setDatePicker] = useState<boolean>(false)

  if (!task) return null
  return (
    <SpacedList>
      <Row as={Card}>
        <Icon name="calendar" />
        <Text
          style={{ flex: 1 }}
          variant="input"
          onPress={() => setDatePicker(true)}>
          {!!form.date && new Date(form.date as number).toDateString()}
        </Text>
      </Row>
      <Row>
        <Row as={Card} style={{ flex: 2 }}>
          <Icon name="star" />
          <NumberInput
            placeholder="Points"
            style={{ flex: 1 }}
            minValue={1}
            maxValue={255}
            value={form.points}
            onChangeText={p => {
              setField('points')(p)
              setField('isFull')(p >= pointsRemaining)
            }}
          />
          <Text>/</Text>
          <Text size="regular">{pointsRemaining}</Text>
        </Row>
        <Pressable
          style={{ flex: 4 }}
          onPress={() => setField('isFull')(!form.isFull)}>
          <Row as={Card}>
            <Icon name="check-circle" />
            <Text style={{ flex: 1 }}>
              {form.isFull ? 'Fully complete!' : 'Partially complete'}
            </Text>
            <Switch
              style={{ height: theme.sizes.inputHeight - theme.spacing.s }}
              value={form.isFull}
              onValueChange={setField('isFull')}
            />
          </Row>
        </Pressable>
      </Row>
      {!!datePicker && (
        <DateTimePicker
          mode="date"
          maximumDate={add(new Date(), { days: 1 })}
          value={new Date(form.date ?? Date.now())}
          onChange={(e, date) => {
            setDatePicker(false)
            if (e.type === 'set') setField('date')(date!.valueOf())
          }}
        />
      )}
    </SpacedList>
  )
}

export default CompleteTask
