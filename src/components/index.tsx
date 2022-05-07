import React, { Ref } from 'react'
import { TextInputProps, TextInput as RNTextInput } from 'react-native'
import styled from '@emotion/native'
import { useTheme } from '@emotion/react'
import { Theme } from '../theme'
import { inputStyle } from '../styles'

export * from './Picker'
export * from './Text'
export * from './Icon'
export * from './SpacedList'
export * from './Button'
export * from './IconButton'

const BaseTextInput = styled.TextInput(inputStyle)

export const TextInput = React.forwardRef(
  (props: React.ComponentProps<typeof BaseTextInput>, ref: Ref<RNTextInput>) => {
    const theme = useTheme()
    return (
      <BaseTextInput
        ref={ref}
        placeholderTextColor={theme.colors.placeholderText}
        {...props}
      />
    )
  }
)

export const Section = styled.View(({ theme }) => ({
  marginHorizontal: theme.spacing.m,
  marginTop: theme.spacing.s,
}))

export const Card = styled.View(({ theme: { spacing, colors } }) => ({
  backgroundColor: colors.foreground,
  paddingHorizontal: spacing.l,
  paddingVertical: spacing.s,
  borderRadius: spacing.s,
}))

export const Spacer = styled.View<{ size?: keyof Theme['spacing'] }>(
  ({ size = 's', theme }) => ({
    flex: 0,
    flexBasis: theme.spacing[size],
    minWidth: theme.spacing[size],
    minHeight: theme.spacing[size],
  })
)

type DividerProps = {
  direction?: 'h' | 'v'
  size?: keyof Theme['spacing']
  color?: keyof Theme['colors']
}
export const Divider = styled(Spacer)<DividerProps>(
  ({ direction = 'h', size = 's', color = 'underline', theme }) => ({
    alignSelf: 'stretch',
    ...(direction === 'h' && {
      borderBottomWidth: 1,
      marginBottom: theme.spacing[size],
    }),
    ...(direction === 'v' && {
      borderRightWidth: 1,
      marginRight: theme.spacing[size],
    }),
    borderColor: theme.colors[color],
  })
)
