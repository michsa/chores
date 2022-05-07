import React, { useLayoutEffect } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from '@emotion/react'

import {
  Text,
  IconButton,
  Row,
  SpacedList,
} from '../components'
import { useDispatch, useSelector } from '../hooks'
import { getTask, getCategories } from '../redux/selectors'
import { NavigationProps, CompletionSettings } from '../types'

const defaultSetings: Partial<CompletionSettings> = {
  date: undefined,
  points: undefined,
  isPartial: undefined,
  category: undefined
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

  const onSubmit = () => {}

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
  }, [navigation, task])

  if (!task) return null
  return (
    <ScrollView>
      <SpacedList><Text>hello</Text>
      </SpacedList>
    </ScrollView>
  )
}

export default CompleteTask
