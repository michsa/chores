import React, { useState, useLayoutEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Pressable,
  ScrollView,
  ToastAndroid,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/Feather'

import { useDispatch, useForm, useSelector } from '../hooks'
import { upsertTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import { elementStyle, dividerStyle, fieldStyle, inputStyle, selectInputStyle } from '../styles'
import { Task, TaskSettings, Frequency, NavigationProps } from '../types'
import { priorityOptions } from '../utils'
import EditRecurrence from './EditRecurrence'
import NumericTextInput from './NumericTextInput'

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
          color="teal"
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
      <Text
        style={{
          ...inputStyle,
          flex: 1,
          paddingLeft: 8,
          paddingBottom: 8,
          paddingTop: 16,
          color: 'black',
          fontSize: 16,
          marginLeft: 12,
        }}
        onPress={() => setDatePicker(field)}>
        {!!form[field] && new Date(form[field] as number).toDateString()}
      </Text>
      <Icon
        name="x"
        color="teal"
        style={{ paddingHorizontal: 24 }}
        size={24}
        onPress={() => setField(field)(undefined)}
      />
    </View>
  )

  return (
    <ScrollView>
      <View style={fieldStyle}>
        <TextInput
          placeholder="Name"
          style={{ ...inputStyle, fontSize: 20 }}
          value={form.name}
          onChangeText={setField('name')}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            ...fieldStyle,
            flex: 2,
            marginRight: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="star" size={20} />
          <NumericTextInput
            placeholder="Points"
            style={{ ...inputStyle, flex: 1, marginLeft: 12 }}
            minValue={1}
            maxValue={999}
            value={form.points}
            onChangeText={setField('points')}
          />
        </View>
        <View style={dividerStyle} />
        <View
          style={{
            ...fieldStyle,
            flex: 3,
            marginLeft: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="flag" size={20} style={{ marginRight: 8 }} />
          <View
            style={{ ...selectInputStyle, flex: 1 }}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={form.priority}
              onValueChange={setField('priority')}>
              {priorityOptions.map(({ label, value }) => (
                <Picker.Item key={value} {...{ label, value }} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      <View
        style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="tag" size={20} />

        <TextInput
          placeholder="Tags"
          style={{ ...inputStyle, flex: 1, marginLeft: 12, paddingLeft: 8 }}
          value={form.tags.join(' ')}
          onChangeText={text => setField('tags')(text.split(' '))}
        />
      </View>
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
        <View
          style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="calendar" size={20} />
          <DateField field="scheduled" />
        </View>
      )}
      {!!form.deadline && (
        <View style={fieldStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="alert-circle" size={20} />
            <DateField field="deadline" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
              marginLeft: 4,
              marginRight: 8,
            }}>
            <Text
              style={{
                marginRight: 16,
                flex: 0,
              }}>
              Notify
            </Text>
            <EditRecurrence
              style={{ flex: 3 }}
              value={form.deadlineWarning}
              onChange={setField('deadlineWarning')}
            />
            <Text
              style={{
                marginLeft: 16,
                flex: 0,
              }}>
              before
            </Text>
          </View>
        </View>
      )}
      {!!(form.scheduled || form.deadline) && (
        <View style={fieldStyle}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: inputStyle.height,
            }}>
            <Text style={{ flex: 0 }}>Repeat</Text>
            {form.isRecurring && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Text style={{ marginHorizontal: 4 }}>after</Text>
                <EditRecurrence
                  style={{ flex: 1 }}
                  value={form.recurrence}
                  onChange={setField('recurrence')}
                />
              </View>
            )}
            <Pressable
              style={{ flex: form.isRecurring ? 0 : 1 }}
              onPress={() => setField('isRecurring')(!form.isRecurring)}>
              <Switch
                value={form.isRecurring}
                onValueChange={setField('isRecurring')}
              />
            </Pressable>
          </View>
        </View>
      )}

      <View style={fieldStyle}>
        <Text>Notes</Text>
        <TextInput
          style={{
            ...inputStyle,
            minHeight: inputStyle.height,
            height: 'auto',
          }}
          autoCorrect={false}
          value={form.description}
          onChangeText={setField('description')}
          multiline
        />
      </View>
    </ScrollView>
  )
}

export default EditTask
