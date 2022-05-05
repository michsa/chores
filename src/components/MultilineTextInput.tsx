import React, { useState } from 'react'
import { TextInputProps } from 'react-native'
import { useTheme } from '@emotion/react'

import { TextInput } from '../components'

const MultilineTextInput = (props: TextInputProps) => {
  const theme = useTheme()
  const [height, setHeight] = useState(0)
  return (
    <TextInput
      style={{
        paddingHorizontal: 0,
        paddingVertical: theme.spacing.s,
        marginTop: 0,
        height: height + theme.spacing.s,
      }}
      onContentSizeChange={event => {
        const { contentSize } = event.nativeEvent
        console.log({ contentSize })
        setHeight(contentSize.height)
      }}
      multiline
      textAlignVertical="top"
      {...props}
    />
  )
}
export default MultilineTextInput
