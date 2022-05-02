import React, { useState, useLayoutEffect } from 'react'
import {
  View,
  Switch,
  Button,
  Pressable,
  ScrollView,
  ToastAndroid,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '@emotion/react'

import { useDispatch, useForm, useSelector } from '../hooks'
import { upsertTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import { TaskSettings, Frequency, NavigationProps } from '../types'
import { priorityOptions } from '../utils'
import {
  Text,
  Card,
  Section,
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
import NumericTextInput from '../components/NumericTextInput'

const defaultRecurrence = { frequency: Frequency.WEEK, interval: 1 }

const defaultSetings: TaskSettings = {
  name: '',
  points: 1,
  priority: 0,
  isRecurring: false,
  recurrence: defaultRecurrence,
  deadlineWarning: defaultRecurrence,
  description: '',
  tags: [],
}

const useTaskIfExists = (id?: string): TaskSettings => {
  const task = id ? useSelector(getTaskById(id)) : undefined
  return task?.settings ?? defaultSetings
}

const validate = (form: Partial<TaskSettings>): TaskSettings => {
  if (!form.name) throw Error('Task must have a name')
  if (!form.points) throw Error('Task must have points')

  return form as TaskSettings
}

const cleanup = (form: TaskSettings) => {
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
  const { form, setField } = useForm<TaskSettings>(settings)

  const onSubmit = () => {
    console.log('onSubmit', form)
    try {
      const formToSubmit = validate(form)
      const { payload: task } = upsertTask(dispatch)(cleanup(formToSubmit), params?.id)
      navigation.navigate('viewTask', { id: task.id })
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

  const DateField = ({ field }: { field: DateField }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FakeInputText style={{ flex: 1 }} onPress={() => setDatePicker(field)}>
        {!!form[field] && new Date(form[field] as number).toDateString()}
      </FakeInputText>
      <Icon
        name="x"
        color="accent"
        style={{ paddingHorizontal: 24 }}
        size="header"
        onPress={() => setField(field)(undefined)}
      />
    </View>
  )

  return (
    <ScrollView>
      <SpacedList style={{ margin: theme.spacing.s }}>
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
        <Row as={Card}>
          <Icon name="tag" />
          <TextInput
            placeholder="Tags"
            style={{ flex: 1 }}
            value={form.tags.join(' ')}
            onChangeText={text => setField('tags')(text.split(' '))}
          />
        </Row>
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
        {!!form.scheduled && (
          <Row as={Card}>
            <Icon name="calendar" />
            <DateField field="scheduled" />
          </Row>
        )}
        {!!form.deadline && (
          <SpacedList as={Card}>
            <Row>
              <Icon name="alert-circle" />
              <DateField field="deadline" />
            </Row>
            <Row>
              <Text>Notify</Text>
              <EditRecurrence
                style={{ flex: 1 }}
                value={form.deadlineWarning}
                onChange={setField('deadlineWarning')}
              />
              <Text>before</Text>
              <Spacer size="xs" />
            </Row>
          </SpacedList>
        )}
        {!!(form.scheduled || form.deadline) && (
          <Row spacing="xs" as={Card} style={{ height: theme.sizes.inputHeight }}>
            <Text>Repeat</Text>
            {form.isRecurring && (
              <>
                <Text style={{ marginRight: theme.spacing.s }}>after</Text>
                <EditRecurrence
                  style={{ flex: 1 }}
                  value={form.recurrence}
                  onChange={setField('recurrence')}
                />
              </>
            )}
            <Pressable
              style={{ flex: 1, paddingLeft: theme.spacing.xl }}
              onPress={() => setField('isRecurring')(!form.isRecurring)}>
              <Switch
                value={form.isRecurring}
                onValueChange={setField('isRecurring')}
              />
            </Pressable>
          </Row>
        )}

        <Card>
          <Text>Notes</Text>
          <TextInput
            style={{
              minHeight: theme.sizes.inputHeight,
              height: 'auto',
              paddingHorizontal: 0,
            }}
            autoCorrect={false}
            value={form.description}
            onChangeText={setField('description')}
            multiline
          />
        </Card>
      </SpacedList>
    </ScrollView>
  )
}

export default EditTask
