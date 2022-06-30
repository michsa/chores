import React, { useLayoutEffect } from 'react'
import { Pressable, Switch, ToastAndroid, View } from 'react-native'
import { useTheme } from '@emotion/react'
import { add } from 'date-fns'
import { maxBy } from 'lodash'

import {
  Card,
  ViewCard,
  Text,
  IconButton,
  Row,
  SpacedList,
  Icon,
} from '../components'
import PointsRemaining from '../components/PointsRemaining'
import MultilineTextInput from '../components/MultilineTextInput'
import NumberInput from '../components/NumberInput'
import DateTimeInput from '../components/DateTimeInput'
import { useDispatch, useSelector, useForm } from '../hooks'
import { getTask } from '../redux/selectors'
import { completeTask } from '../redux/thunks'
import {
  NavigationProps,
  CompletionInput,
  DateTime,
  TaskSettings,
} from '../types'
import {
  toDateTime,
  addRecurrence,
  toDate,
  printRecurrence,
  printDate,
} from '../utils'

type PartialCompletionInput = Omit<CompletionInput, 'points'> & {
  points?: number
  nextDate?: DateTime
  notes?: string
}

const validate = (form: PartialCompletionInput): CompletionInput => {
  if (!form.points) throw Error('Completion must have points')

  return form as CompletionInput
}

const calcDefaultNextDate = (
  settings: TaskSettings,
  completionDate: DateTime
) => {
  if (!settings.isRecurring) return undefined

  const scheduleOrDeadline = settings.scheduled ?? settings.deadline
  const recurrenceBasis = maxBy(
    [
      scheduleOrDeadline,
      { date: completionDate.date, time: scheduleOrDeadline.time },
    ],
    r => r && toDate(r)
  )!
  return addRecurrence(settings.recurrence, recurrenceBasis)
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
  const defaultDateTime = toDateTime(new Date(), true)

  const { form, setField } = useForm<PartialCompletionInput>({
    date: defaultDateTime,
    points: pointsRemaining,
    isFull: true,
  })

  const defaultNextDate = calcDefaultNextDate(task.settings, form.date)

  const onSubmit = () => {
    console.log('completeTask', form)

    try {
      const nextDate = form.nextDate ?? defaultNextDate
      const formToSubmit = validate({ ...form, nextDate })
      dispatch(completeTask(formToSubmit, task.id))
      navigation.goBack()
      // navigation.navigate('viewTask', { id })
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

  return (
    <SpacedList style={{ margin: theme.spacing.s }}>
      <Row as={ViewCard}>
        <Icon name="check" size="large" />
        <Text size="large">{task.settings.name}</Text>
      </Row>
      <Row as={Card}>
        <DateTimeInput
          icon="stopwatch"
          value={form.date}
          onChange={setField('date')}
          maximumDate={add(new Date(), { days: 1 })}
        />
      </Row>
      <Row>
        <Row as={Card} style={{ flex: 3 }}>
          <Icon name="star" />
          <NumberInput
            placeholder="Pts"
            style={{ flex: 1 }}
            minValue={1}
            maxValue={255}
            value={form.points}
            onChangeText={p => {
              setField('points')(p)
              setField('isFull')(p >= pointsRemaining)
            }}
          />
          <Text>of</Text>
          <PointsRemaining {...task} />
        </Row>
        <Pressable
          style={{ flex: 4 }}
          onPress={() => setField('isFull')(!form.isFull)}>
          <Row as={Card}>
            <Icon name={form.isFull ? 'check-circle' : 'circle'} />
            <Text style={{ flex: 1 }}>
              {form.isFull ? 'Complete!' : 'Partial'}
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
          <Row spacing="m" style={{ alignItems: 'flex-end' }}>
            <Text style={{ flex: 0 }}>
              Next {task.settings.deadline ? 'deadline' : 'scheduled'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                flex: 1,
                justifyContent: 'flex-end',
              }}>
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
                  <Icon
                    size="small"
                    color="placeholderText"
                    name="alert-circle"
                  />
                  <Text color="placeholderText">
                    {printDate(task.settings.deadline)}
                  </Text>
                </Row>
              )}
              <Row style={{ marginLeft: theme.spacing.s }}>
                <Icon size="small" color="placeholderText" name="repeat" />
                <Text color="placeholderText">
                  {printRecurrence(task.settings.recurrence)}
                </Text>
              </Row>
            </View>
          </Row>
          {form.nextDate ? (
            <DateTimeInput
              icon="repeat"
              value={form.nextDate}
              onChange={setField('nextDate')}
              clearable
              startOpen
            />
          ) : (
            <Row>
              <Icon name="repeat" />
              <Text
                variant="input"
                style={{ flex: 1, borderBottomColor: theme.colors.foreground }}>
                {defaultNextDate && printDate(defaultNextDate)}
              </Text>
              <IconButton
                size="small"
                name="edit-2"
                color="text"
                onPress={() => setField('nextDate')(defaultNextDate)}
              />
            </Row>
          )}
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
