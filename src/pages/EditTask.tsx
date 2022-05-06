import React, { useState, useLayoutEffect } from 'react'
import { View, Switch, Button, Pressable, ToastAndroid } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '@emotion/react'

import { useDispatch, useForm, useSelector } from '../hooks'
import { upsertTask } from '../redux/thunks'
import { getTaskWithTags } from '../redux/selectors'
import { TaskSettingsInput, Frequency, NavigationProps } from '../types'
import { priorityOptions } from '../utils'
import {
  Text,
  Card,
  Spacer,
  TextInput,
  Icon,
  HeaderIcon,
  Picker,
  FakeInputText,
  SpacedList,
  Row,
} from '../components'
import EditRecurrence from '../components/EditRecurrence'
import MultilineTextInput from '../components/MultilineTextInput'
import NumericTextInput from '../components/NumericTextInput'
import TagsInput from '../components/TagsInput'

const defaultRecurrence = { frequency: Frequency.WEEK, interval: 1 }

const defaultSetings: TaskSettingsInput = {
  name: '',
  points: 1,
  priority: 0,
  isRecurring: true,
  recurrence: defaultRecurrence,
  deadlineWarning: defaultRecurrence,
  description: '',
  tagNames: [],
}

const useTaskIfExists = (id?: string): TaskSettingsInput => {
  const task = id ? useSelector(getTaskWithTags, id) : undefined
  return task
    ? { ...task.settings, tagNames: task.tags.map(tag => tag?.name) }
    : defaultSetings
}

const validate = (form: Partial<TaskSettingsInput>): TaskSettingsInput => {
  if (!form.name) throw Error('Task must have a name')
  if (!form.points) throw Error('Task must have points')

  return form as TaskSettingsInput
}

const cleanup = (form: TaskSettingsInput) => {
  if (form.deadlineWarning && !form.deadline) {
    delete form.deadlineWarning
  }
  if (!form.scheduled && !form.deadline) {
    form.isRecurring = false
  }
  if (form.recurrence && !form.isRecurring) {
    delete form.recurrence
  }
  return form
}

const EditTask = ({
  navigation,
  route: { params },
}: NavigationProps['addTask'] | NavigationProps['editTask']) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const settings = useTaskIfExists(params?.id)
  const { form, setField } = useForm<TaskSettingsInput>(settings)

  const onSubmit = () => {
    console.log('onSubmit', form)
    try {
      const formToSubmit = validate(form)
      const id = dispatch(upsertTask(cleanup(formToSubmit), params?.id))
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
        <HeaderIcon name="save" color="accent" onPress={onSubmit} />
      ),
    })
  }, [navigation, form])

  type DateField = 'scheduled' | 'deadline'
  const [datePicker, setDatePicker] = useState<DateField | null>(null)

  const DateField = ({
    field,
    children,
  }: {
    field: DateField
    children?: React.ReactNode
  }) => (
    <Row spacing="m">
      <Row style={{ flex: 1 }}>
        <Icon name={field === 'scheduled' ? 'calendar' : 'alert-circle'} />
        <FakeInputText style={{ flex: 1 }} onPress={() => setDatePicker(field)}>
          {!!form[field] && new Date(form[field] as number).toDateString()}
        </FakeInputText>
      </Row>
      <Icon
        name="delete"
        color="accent"
        size="header"
        onPress={() => setField(field)(undefined)}
      />
    </Row>
  )

  return (
    <SpacedList
      as={KeyboardAwareScrollView}
      style={{ margin: theme.spacing.s, flex: 1, zIndex: 1 }}
      // this allows us to select a tag from the dropdown without first collapsing the keyboard
      keyboardShouldPersistTaps="always">
      <Card>
        <TextInput
          placeholder="Name"
          style={{ fontSize: theme.fontSizes.large }}
          value={form.name}
          onChangeText={setField('name')}
        />
      </Card>
      <Row>
        <Row as={Card} style={{ flex: 2 }}>
          <Icon name="star" />
          <NumericTextInput
            placeholder="Points"
            style={{ flex: 1 }}
            minValue={1}
            maxValue={999}
            value={form.points}
            onChangeText={setField('points')}
          />
        </Row>
        <Row as={Card} style={{ flex: 3 }}>
          <Icon name="flag" />
          <Picker
            selectedValue={form.priority}
            onValueChange={setField('priority')}
            options={priorityOptions}
          />
        </Row>
      </Row>

      <TagsInput value={form.tagNames} onUpdate={setField('tagNames')} />

      {!form.scheduled && !form.deadline && (
        <Row style={{ padding: theme.spacing.s }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Set scheduled time"
              onPress={() => setDatePicker('scheduled')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Set deadline"
              onPress={() => setDatePicker('deadline')}
            />
          </View>
        </Row>
      )}
      {!!(form.scheduled || form.deadline) && (
        <SpacedList as={Card}>
          {!!form.scheduled && <DateField field="scheduled" />}
          {!!form.deadline && <DateField field="deadline" />}
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
            <Text>{form.isRecurring ? 'Repeat after' : 'Do not repeat'}</Text>
            {form.isRecurring && (
              <EditRecurrence
                value={form.recurrence}
                onChange={setField('recurrence')}
              />
            )}
            <Pressable
              style={{ flex: 1, paddingLeft: theme.spacing.xl }}
              onPress={() => setField('isRecurring')(!form.isRecurring)}>
              <Switch
                style={{ height: theme.sizes.inputHeight - theme.spacing.s }}
                value={form.isRecurring}
                onValueChange={setField('isRecurring')}
              />
            </Pressable>
          </Row>
        </SpacedList>
      )}

      <Card>
        <Text>Notes</Text>
        <MultilineTextInput
          value={form.description}
          onChangeText={setField('description')}
        />
      </Card>

      {!!datePicker && (
        <DateTimePicker
          mode="date"
          minimumDate={new Date()}
          value={new Date(form.scheduled ?? Date.now())}
          onChange={(e, date) => {
            setDatePicker(null)
            if (e.type === 'set') setField(datePicker)(date?.valueOf())
          }}
        />
      )}
    </SpacedList>
  )
}

export default EditTask
