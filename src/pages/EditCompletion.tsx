import React, { useLayoutEffect } from 'react'
import { Pressable, Switch, ToastAndroid } from 'react-native'
import { useTheme } from '@emotion/react'
import { add } from 'date-fns'
import { maxBy } from 'lodash'

import { Card, Text, IconButton, Row, SpacedList, Icon } from '../components'
import MultilineTextInput from '../components/MultilineTextInput'
import NumberInput from '../components/NumberInput'
import DateTimeInput from '../components/DateTimeInput'
import { useDispatch, useSelector, useForm } from '../hooks'
import { getTask } from '../redux/selectors'
import { completeTask } from '../redux/thunks'
import { NavigationProps, CompletionInput, DateTime } from '../types'
import {
  toDateTime,
  addRecurrence,
  toDate,
  printRecurrence,
  printDate,
} from '../utils'

const defaultDateTime = toDateTime(new Date(), true)

type PartialCompletionInput = Omit<CompletionInput, 'points'> & {
  points?: number
  nextDate?: DateTime
  notes?: string
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
    date: defaultDateTime,
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

  const scheduleOrDeadline = task.settings.scheduled ?? task.settings.deadline
  const recurrenceBasis = maxBy(
    [
      scheduleOrDeadline,
      { date: form.date.date, time: scheduleOrDeadline?.time },
    ],
    r => r && toDate(r)
  )
  console.log({ recurrenceBasis })

  if (!task) return null
  return (
    <SpacedList style={{ margin: theme.spacing.s }}>
      <Row as={Card}>
        <DateTimeInput
          icon="calendar"
          value={form.date}
          onChange={setField('date')}
          maximumDate={add(new Date(), { days: 1 })}
        />
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
      {form.isFull && task.settings.isRecurring && (
        <SpacedList as={Card}>
          <Row spacing="m">
            <Text style={{ flex: 1 }}>Repeat on</Text>
            {task.settings.scheduled && (
              <Row>
                <Icon size="small" color="placeholderText" name="calendar" />
                <Text color="placeholderText">
                  {printDate(task.settings.scheduled)}
                </Text>
              </Row>
            )}
            {task.settings.deadline && (
              <Row>
                <Icon size="small" name="alert-circle" />
                <Text>{printDate(task.settings.deadline)}</Text>
              </Row>
            )}
            <Row>
              <Icon size="small" color="placeholderText" name="repeat" />
              <Text color="placeholderText">
                {printRecurrence(task.settings.recurrence!)}
              </Text>
            </Row>
          </Row>
          <DateTimeInput
            icon="repeat"
            value={addRecurrence(task.settings.recurrence!, recurrenceBasis!)}
            onChange={setField('nextDate')}
          />
        </SpacedList>
      )}
      <Card>
        <Text>Notes</Text>
        <MultilineTextInput
          value={form.notes}
          onChangeText={setField('notes')}
        />
      </Card>
    </SpacedList>
  )
}

export default CompleteTask
