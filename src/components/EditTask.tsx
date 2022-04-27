import React, { useRef, useState } from 'react'
import { View, Text, TextInput, Switch } from 'react-native'
import { TaskSettings } from '../types'

const useForm = <T extends { [k: string]: unknown }>(defaults: T) => {
  const [form, setForm] = useState<T>(defaults)
  return {
    form,
    updateField: (key: string) => (value: unknown) =>
      setForm(currentForm => ({ ...currentForm, [key]: value })),
  }
}

type TaskSettingsInput = Omit<TaskSettings, 'points'> & { points?: string }

const EditTask = () => {
  let descRef: TextInput | null

  let { form, updateField } = useForm<TaskSettingsInput>({
    name: '',
    icon: '',
    points: '',
    priority: 0,
    isRecurring: false,
    description: '',
    tags: [],
  })

  return (
    <View>
      <View>
        <Text>Name</Text>
        <TextInput
          value={form.name}
          onChangeText={updateField('name')}
          onSubmitEditing={() => descRef?.focus()}
        />
      </View>
      <View>
        <Text>Notes</Text>
        <TextInput
          value={form.description}
          onChangeText={updateField('description')}
          multiline
          ref={i => (descRef = i)}
        />
      </View>
      <View>
        <Text>Is recurring?</Text>
        <Switch
          value={form.isRecurring}
          onValueChange={updateField('isRecurring')}
        />
      </View>
      <View>
        <Text>Points</Text>
        <TextInput
          value={form.points?.toString()}
          keyboardType="numeric"
          onChangeText={updateField('points')}
          multiline
          ref={i => (descRef = i)}
        />
      </View>
    </View>
  )
}

export default EditTask
