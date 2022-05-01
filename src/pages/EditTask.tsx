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
// import { Picker } from '@react-native-picker/picker'

import { useDispatch, useForm, useSelector } from '../hooks'
import { upsertTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import {
  elementStyle,
  dividerStyle,
  fieldStyle,
  inputStyle,
  selectInputStyle,
} from '../styles'
import { TaskSettings, Frequency, NavigationProps } from '../types'
import { priorityOptions } from '../utils'
import {
  Text,
  Card,
  TextInput,
  Icon,
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
        <Icon
          name="save"
          size={24}
          color="accent"
          style={{ padding: 8, marginRight: 12 }}
          onPress={onSubmit}
        />
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
          style={{ fontSize: 20 }}
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
          <View style={dividerStyle} />
          <NumericTextInput
            placeholder="Points"
            style={{ flex: 1 }}
            minValue={1}
            maxValue={999}
            value={form.points}
            onChangeText={setField('points')}
          />
        </Card>
        <View style={dividerStyle} />
        <Card
          style={{
            flex: 3,
            marginLeft: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="flag" />
          <View style={dividerStyle} />
          <Picker
            selectedValue={form.priority}
            onValueChange={setField('priority')}
            options={priorityOptions}
          />
        </Card>
      </View>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="tag" />
        <View style={dividerStyle} />
        <TextInput
          placeholder="Tags"
          style={{ flex: 1, paddingLeft: 8 }}
          value={form.tags.join(' ')}
          onChangeText={text => setField('tags')(text.split(' '))}
        />
      </Card>
      {!form.scheduled && !form.deadline && (
        <View
          style={{
            ...elementStyle,
            flexDirection: 'row',
            padding: 8,
          }}>
          <View style={{ flex: 1, marginRight: 0 }}>
            <Button
              title="Set scheduled time"
              onPress={() => setDatePicker('scheduled')}
            />
          </View>
          <View style={dividerStyle} />
          <View style={{ flex: 1, marginLeft: 0 }}>
            <Button
              title="Set deadline"
              onPress={() => setDatePicker('deadline')}
            />
          </View>
        </View>
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
          <Icon name="calendar" size={20} />
          <View style={dividerStyle} />
          <DateField field="scheduled" />
        </Card>
      )}
      {!!form.deadline && (
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="alert-circle" size={20} />
            <View style={dividerStyle} />
            <DateField field="deadline" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
              marginLeft: 4,
              marginRight: 8,
            }}>
            <Text>Notify</Text>
            <View style={dividerStyle} />
            <EditRecurrence
              style={{ flex: 1 }}
              value={form.deadlineWarning}
              onChange={setField('deadlineWarning')}
            />
            <View style={dividerStyle} />
            <Text>before</Text>
          </View>
        </Card>
      )}
      {!!(form.scheduled || form.deadline) && (
        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: inputStyle.height,
            }}>
            <Text>Repeat</Text>
            {form.isRecurring && (
              <>
                <Text style={{ marginRight: 8 }}> after</Text>
                <EditRecurrence
                  style={{ flex: 1 }}
                  value={form.recurrence}
                  onChange={setField('recurrence')}
                />
              </>
            )}
            <Pressable
              style={{ flex: 1, paddingLeft: 24 }}
              onPress={() => setField('isRecurring')(!form.isRecurring)}>
              <Switch
                value={form.isRecurring}
                onValueChange={setField('isRecurring')}
              />
            </Pressable>
          </View>
        </Card>
      )}

      <Card>
        <Text>Notes</Text>
        <TextInput
          style={{
            minHeight: inputStyle.height,
            height: 'auto',
            paddingHorizontal: 0
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
