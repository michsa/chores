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
import type { StackScreenProps } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { TaskSettings, Frequency, RootStackParamList } from '../types'
import { useDispatch, useForm } from '../hooks'
import { createTask } from '../redux/actions'
import EditRecurrence from './EditRecurrence'
import NumericTextInput from './NumericTextInput'

const elementStyle = {
  marginHorizontal: 12,
  marginTop: 8,
  marginBottom: 0,
}

const dividerStyle = {
  flexBasis: 12,
}

const fieldStyle = {
  ...elementStyle,
  backgroundColor: '#FFF',
  padding: 8,
}

const inputStyle = {
  borderBottomWidth: 1,
  borderBottomColor: 'lightgrey',
  paddingBottom: 4,
  fontSize: 16,
  height: 46,
  // backgroundColor: '#f6f6f6',
  borderRadius: 4
}

type TaskSettingsInput = TaskSettings

const validate = (inputForm: TaskSettingsInput): TaskSettings => {
  const formToSubmit: TaskSettings = { ...inputForm }
  // clear out default values for recurrence if we don't need them
  if (!inputForm.isRecurring) formToSubmit.recurrence = undefined

  return formToSubmit
}

type NavigationProps = StackScreenProps<RootStackParamList, 'addTask'>;

const EditTask = ({ navigation }: NavigationProps) => {
  const dispatch = useDispatch()
  const { form, setField } = useForm<TaskSettingsInput>({
    name: '',
    icon: '',
    points: 1,
    priority: 0,
    isRecurring: false,
    recurrence: { frequency: Frequency.WEEK, interval: 1 },
    description: '',
    tags: [],
  })
  const [datePicker, setDatePicker] = useState<'scheduled' | 'deadline' | null>(
    null
  )

  const onSubmit = () => {
    const formToSubmit = validate(form)
    dispatch(createTask(formToSubmit))
    navigation.goBack()
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={onSubmit} title="Save" />
      ),
    });
  }, [navigation]);

  const DateField = ({ field }: { field: 'scheduled' | 'deadline' }) => (
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
        {form[field]?.toDateString()}
      </Text>
      <Button title="clear" onPress={() => setField(field)(undefined)} />
    </View>
  )

  return (
    <ScrollView>
      <View style={fieldStyle}>
        {/* <Text>Name</Text> */}
        <TextInput
          placeholder="Name"
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
              <Picker.Item label="Highest" value={2} />
              <Picker.Item label="High" value={1} />
              <Picker.Item label="Standard" value={0} />
              <Picker.Item label="Low" value={-1} />
              <Picker.Item label="Lowest" value={-2} />
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
          value={form.scheduled ?? new Date()}
          onChange={(_, date) => {
            setDatePicker(null)
            setField(datePicker)(date)
          }}
        />
      )}
      {!!form.scheduled && (
        <View
          style={{
            ...fieldStyle,
          }}>
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
              Warn
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
          style={{ borderColor: 'lightgrey', borderBottomWidth: 1 }}
          value={form.description}
          onChangeText={setField('description')}
          multiline
        />
      </View>
    </ScrollView>
  )
}

export default EditTask
