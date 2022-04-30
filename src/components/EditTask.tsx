import React, { useState, useLayoutEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Pressable,
  ScrollView,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/Feather'

import { useDispatch, useForm, useSelector } from '../hooks'
import { upsertTask } from '../redux/actions'
import { getTaskById } from '../redux/selectors'
import { elementStyle, dividerStyle, fieldStyle, inputStyle } from '../styles'
import { Task, TaskSettings, Frequency, NavigationProps } from '../types'
import { priorities } from '../utils'
import EditRecurrence from './EditRecurrence'
import NumericTextInput from './NumericTextInput'

const useTaskIfExists = (id?: string): TaskSettings | Task => {
  const emptyTask: TaskSettings = {
    name: '',
    points: 1,
    priority: 0,
    isRecurring: false,
    recurrence: { frequency: Frequency.WEEK, interval: 1 },
    description: '',
    tags: [],
  }
  const task = id ? useSelector(getTaskById(id)) : undefined
  return task ?? emptyTask
}

const validate = (form: Partial<TaskSettings>): TaskSettings => {
  if (!form.name) throw Error('Task must have a name')

  return form as TaskSettings
}

const EditTask = ({
  navigation,
  route,
}: NavigationProps['addTask'] | NavigationProps['editTask']) => {
  const dispatch = useDispatch()
  const task = useTaskIfExists(route.params?.id)
  const { form, setField } = useForm<TaskSettings>(task)

  const onSubmit = () => {
    console.log('onSubmit', form)
    const formToSubmit = validate(form)
    dispatch(upsertTask(formToSubmit))
    navigation.goBack()
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="check-circle"
          size={24}
          color="mediumseagreen"
          style={{ paddingHorizontal: 16 }}
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
          paddingLeft: 4,
          paddingBottom: 8,
          paddingTop: 16,
          color: 'black',
          marginRight: 16,
          fontSize: 16,
        }}
        onPress={() => setDatePicker(field)}>
        {form[field]?.toString()}
      </Text>
      <Button title="clear" onPress={() => setField(field)(undefined)} />
    </View>
  )

  return (
    <ScrollView>
      <View style={fieldStyle}>
        <Text>Name</Text>
        <TextInput
          style={{ ...inputStyle, fontSize: 18 }}
          value={form.name}
          onChangeText={setField('name')}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ ...fieldStyle, flex: 2, marginRight: 0 }}>
          <Text>Points</Text>
          <NumericTextInput
            style={inputStyle}
            minValue={1}
            maxValue={999}
            value={form.points}
            onChangeText={setField('points')}
          />
        </View>
        <View style={dividerStyle} />
        <View style={{ ...fieldStyle, flex: 3, marginLeft: 0 }}>
          <Text>Priority</Text>
          <View style={inputStyle}>
            <Picker
              selectedValue={form.priority}
              onValueChange={(value: number) => setField('priority')(value)}>
              {Object.entries(priorities).map(([label, value]) => (
                <Picker.Item key={value} {...{ label, value }} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      <View style={fieldStyle}>
        <Text>Tags</Text>
        <TextInput
          style={inputStyle}
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
        <View style={fieldStyle}>
          <Text>Scheduled</Text>
          <DateField field="scheduled" />
        </View>
      )}
      {!!form.deadline && (
        <View style={fieldStyle}>
          <Text>Deadline</Text>
          <DateField field="deadline" />
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
                height: 46,
                lineHeight: 56,
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
                height: 46,
                lineHeight: 56,
                flex: 0,
              }}>
              before
            </Text>
          </View>
        </View>
      )}
      {!!(form.scheduled || form.deadline) && (
        <View style={fieldStyle}>
          <Pressable onPress={() => setField('isRecurring')(!form.isRecurring)}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text>Repeat</Text>
              <Switch
                value={form.isRecurring}
                onValueChange={setField('isRecurring')}
              />
            </View>
          </Pressable>
          {form.isRecurring && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4,
                marginRight: 8,
              }}>
              <Text
                style={{
                  marginRight: 16,
                  height: 46,
                  lineHeight: 56,
                  flex: 0,
                }}>
                After
              </Text>
              <EditRecurrence
                style={{ flex: 3 }}
                value={form.recurrence}
                onChange={setField('recurrence')}
              />
            </View>
          )}
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
