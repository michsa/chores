import React from 'react'
import { TextInputProps } from 'react-native'
import styled from '@emotion/native'
import { useTheme } from '@emotion/react'
import { Theme } from '../theme'
import { inputStyle } from '../styles'

export * from './Picker'
export * from './Text'
export * from './Icon'
export * from './SpacedList'

const BaseTextInput = styled.TextInput(inputStyle)

export const TextInput = (props: TextInputProps) => {
  const theme = useTheme()
  return (
    <BaseTextInput
      placeholderTextColor={theme.colors.placeholderText}
      {...props}
    />
  )
}

export const Section = styled.View(({ theme }) => ({
  marginHorizontal: theme.spacing.m,
  marginTop: theme.spacing.s,
}))

export const Card = styled.View(({ theme: { spacing, colors } }) => ({
  backgroundColor: colors.foreground,
  paddingHorizontal: spacing.l,
  paddingVertical: spacing.s,
  borderRadius: 8,
}))

export const Spacer = styled.View<{ size?: keyof Theme['spacing'] }>(
  ({ size = 's', theme }) => ({
    flex: 0,
    flexBasis: theme.spacing[size],
    minWidth: theme.spacing[size],
    minHeight: theme.spacing[size],
  })
)
