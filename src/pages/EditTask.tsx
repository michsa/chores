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
  Divider,
  TextInput,
  Icon,
  HeaderIcon,
  Picker,
  FakeInputText,
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
      dispatch(upsertTask(cleanup(formToSubmit), params?.id))
      navigation.goBack()
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
        size={24}
        onPress={() => setField(field)(undefined)}
      />
    </View>
  )

  return (
    <ScrollView>
      <Card>
        <TextInput
          placeholder="Name"
          style={{ fontSize: theme.fontSizes.large }}
          value={form.name}
          onChangeText={setField('name')}
        />
      </Card>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Card
          style={{
            flex: 2,
            marginRight: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="star" />
          <Divider />
          <NumericTextInput
            placeholder="Points"
            style={{ flex: 1 }}
            minValue={1}
            maxValue={999}
            value={form.points}
            onChangeText={setField('points')}
          />
        </Card>
        <Divider />
        <Card
          style={{
            flex: 3,
            marginLeft: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="flag" />
          <Divider />
          <Picker
            selectedValue={form.priority}
            onValueChange={setField('priority')}
            options={priorityOptions}
          />
        </Card>
      </View>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="tag" />
        <Divider />
        <TextInput
          placeholder="Tags"
          style={{ flex: 1 }}
          value={form.tags.join(' ')}
          onChangeText={text => setField('tags')(text.split(' '))}
        />
      </Card>
      {!form.scheduled && !form.deadline && (
        <Section style={{ flexDirection: 'row', padding: theme.spacing.s }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Set scheduled time"
              onPress={() => setDatePicker('scheduled')}
            />
          </View>
          <Divider />
          <View style={{ flex: 1 }}>
            <Button
              title="Set deadline"
              onPress={() => setDatePicker('deadline')}
            />
          </View>
        </Section>
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
        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="calendar" />
          <Divider />
          <DateField field="scheduled" />
        </Card>
      )}
      {!!form.deadline && (
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="alert-circle" />
            <Divider />
            <DateField field="deadline" />
          </View>
          <Divider />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text>Notify</Text>
            <Divider />
            <EditRecurrence
              style={{ flex: 1 }}
              value={form.deadlineWarning}
              onChange={setField('deadlineWarning')}
            />
            <Divider />
            <Text>before</Text>
            <Divider />
          </View>
        </Card>
      )}
      {!!(form.scheduled || form.deadline) && (
        <Card
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: theme.sizes.inputHeight,
          }}>
          <Text>Repeat</Text>
          {form.isRecurring && (
            <>
              <Text style={{ marginRight: theme.spacing.s }}> after</Text>
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
        </Card>
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
    </ScrollView>
  )
}

export default EditTask
