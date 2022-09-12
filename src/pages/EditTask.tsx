import React, { useLayoutEffect } from 'react'
import { Switch, Pressable, ToastAndroid } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTheme } from '@emotion/react'
import { sub } from 'date-fns'

import { useDispatch, useForm, useSelector } from '../hooks'
import { upsertTask } from '../redux/thunks'
import { getTaskWithTags } from '../redux/selectors'
import {
  TaskSettings,
  TaskSettingsInput,
  Frequency,
  ScreenProps,
} from '../types'
import { priorityOptions, toDateTime } from '../utils'
import {
  Text,
  Card,
  TextInput,
  Icon,
  IconButton,
  Picker,
  SpacedList,
  Row,
} from '../components'
import EditRecurrence from '../components/EditRecurrence'
import MultilineTextInput from '../components/MultilineTextInput'
import NumberInput from '../components/NumberInput'
import TagsInput from '../components/TagsInput'
import Button from '../components/Button'
import DateTimeInput from '../components/DateTimeInput'

type PartialTaskSettingsInput = Omit<TaskSettingsInput, 'points'> & {
  points?: number
}

const defaultDateTime = toDateTime(new Date())

const defaultInterval = { frequency: Frequency.WEEK, interval: 1, count: 1 }

const defaultSetings: PartialTaskSettingsInput = {
  name: '',
  points: undefined,
  priority: 0,
  type: 'once',
  interval: defaultInterval,
  deadlineWarning: defaultInterval,
  notes: '',
  tagNames: [],
}

const useTaskIfExists = (id?: string): PartialTaskSettingsInput => {
  const task = id ? useSelector(getTaskWithTags, id) : undefined
  return task
    ? {
        ...task.settings,
        tagNames: task.tags.map(tag => tag?.name),
      }
    : defaultSetings
}

const validate = (form: PartialTaskSettingsInput): TaskSettingsInput => {
  if (!form.name) throw Error('Task must have a name')
  if (!form.points) throw Error('Task must have points')

  return form as TaskSettingsInput
}

const cleanup = (form: PartialTaskSettingsInput) => {
  if (form.type === 'bucket') {
    delete form.scheduled
    delete form.deadline
  }
  if (!form.deadline) {
    delete form.deadlineWarning
  }
  if (form.type === 'recurring' && !form.scheduled && !form.deadline) {
    form.type = 'once'
  }
  if (form.type === 'once') {
    delete form.interval
  }
  return form
}

const EditTask = ({
  navigation,
  route: { params },
}: ScreenProps['addTask'] | ScreenProps['editTask']) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const settings = useTaskIfExists(params?.id)
  const { form, setField } = useForm<PartialTaskSettingsInput>(
    settings,
    cleanup
  )

  const toggleBucket = (shouldSet = form.type !== 'bucket') =>
    setField('type')(shouldSet ? 'bucket' : 'once')

  const toggleRecurring = (shouldSet = form.type !== 'recurring') =>
    setField('type')(shouldSet ? 'recurring' : 'once')

  const onSubmit = () => {
    console.log('onSubmit', form)
    try {
      const formToSubmit = validate(form)
      const id = dispatch(upsertTask(formToSubmit, params?.id))
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
          name="save"
          color="accent"
          onPress={onSubmit}
        />
      ),
    })
  }, [navigation, form])

  return (
    <SpacedList
      as={KeyboardAwareScrollView}
      style={{ margin: theme.spacing.s }}
      // this allows us to select a tag from the dropdown without first collapsing the keyboard
      keyboardShouldPersistTaps="always">
      <Card>
        <TextInput
          autoFocus
          placeholder="Name"
          style={{ fontSize: theme.fontSizes.large }}
          value={form.name}
          onChangeText={setField('name')}
        />
      </Card>
      <SpacedList as={Card}>
        <Row spacing="xl">
          <Row style={{ flex: 1 }}>
            <Icon name="star" />
            <NumberInput
              placeholder="Points"
              style={{ flex: 1 }}
              maxValue={50}
              value={form.points}
              onChangeText={setField('points')}
            />
          </Row>
          <Pressable onPress={() => toggleBucket()}>
            <Row style={{ flex: 1 }}>
              <Icon size="regular" name="archive" />
              <Text>Bucket?</Text>
              <Switch
                style={{ height: theme.sizes.inputHeight - theme.spacing.s }}
                value={form.type === 'bucket'}
                onValueChange={toggleBucket}
              />
            </Row>
          </Pressable>
        </Row>
        {form.type === 'bucket' && (
          <Row>
            <Icon size="small" name="calendar" />
            <Text>per</Text>
            <EditRecurrence
              value={form.interval}
              onChange={setField('interval')}
            />
          </Row>
        )}
      </SpacedList>

      <Row as={Card} style={{ flex: 3 }}>
        <Icon name="flag" />
        <Picker
          selectedValue={form.priority}
          onValueChange={setField('priority')}
          options={priorityOptions}
        />
      </Row>

      <TagsInput value={form.tagNames} onUpdate={setField('tagNames')} />

      {!form.scheduled && !form.deadline && form.type !== 'bucket' && (
        <Row style={{ padding: theme.spacing.s }} spacing="m">
          <Button
            style={{ flex: 1 }}
            icon="calendar"
            title="Schedule"
            onPress={() => {
              setField('scheduled')(defaultDateTime)
            }}
          />
          <Button
            style={{ flex: 1 }}
            icon="alert-circle"
            title="Set deadline"
            onPress={() => setField('deadline')(defaultDateTime)}></Button>
        </Row>
      )}
      {!!(form.scheduled || form.deadline) && (
        <SpacedList as={Card}>
          {!!form.scheduled && (
            <DateTimeInput
              clearable
              value={form.scheduled}
              onChange={setField('scheduled')}
              icon="calendar"
              minimumDate={sub(new Date(), { months: 1 })}
            />
          )}
          {!!form.deadline && (
            <DateTimeInput
              clearable
              value={form.deadline}
              onChange={setField('deadline')}
              icon="alert-circle"
              minimumDate={sub(new Date(), { months: 1 })}
            />
          )}
          {!!form.deadline && (
            <Row>
              <Icon size="small" name="calendar" />
              <Text>Schedule</Text>
              <EditRecurrence
                value={form.deadlineWarning}
                onChange={setField('deadlineWarning')}
              />
              <Text>before</Text>
            </Row>
          )}
          <Row>
            <Icon size="small" name="repeat" />
            <Text>
              {form.type === 'recurring' ? 'Repeat after' : 'Do not repeat'}
            </Text>
            {form.type === 'recurring' && (
              <EditRecurrence
                value={form.interval}
                onChange={setField('interval')}
              />
            )}
            <Pressable
              style={{ flex: 1, paddingLeft: theme.spacing.xl }}
              onPress={() => toggleRecurring()}>
              <Switch
                style={{ height: theme.sizes.inputHeight - theme.spacing.s }}
                value={form.type === 'recurring'}
                onValueChange={toggleRecurring}
              />
            </Pressable>
          </Row>
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

export default EditTask
