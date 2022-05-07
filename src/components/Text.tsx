import React from 'react'
import { TextProps as RNTextProps } from 'react-native'
import styled from '@emotion/native'
import { inputStyle } from '../styles'
import { variants } from './utils'
import { Theme } from '../theme'

type ThemeProps = {
  color?: keyof Theme['colors']
  size?: keyof Theme['fontSizes']
}
export type TextProps = RNTextProps & ThemeProps

const BaseText = styled.Text<ThemeProps>(
  ({ theme, color = 'text', size = 'small' }) => ({
    color: theme.colors[color],
    fontSize: theme.fontSizes[size],
  })
)

export const PrimaryText = (props: TextProps) => (
  <BaseText color="primaryText" size="regular" {...props} />
)

export const PropertyText = styled(PrimaryText)(({ theme }) => ({
  paddingVertical: theme.spacing.s,
}))

export const Tag = styled.Text<{ color?: keyof Theme['colors'] }>(
  ({ theme, color }) => ({
    backgroundColor: color ?? theme.colors.underline,
    color: theme.colors.primaryText,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.s,
  })
)

export const FakeInputText = styled.Text(({ theme }) => [
  inputStyle,
  {
    paddingBottom: theme.spacing.s,
    paddingTop: theme.spacing.l,
    fontSize: theme.spacing.l,
  },
])

export const ButtonText = styled(BaseText)(
  ({ theme, color = 'primaryText' }) => ({
    flexShrink: 1,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.s,
    color: theme.colors[color],
    textTransform: 'uppercase',
    fontWeight: 'bold',
  })
)

export const Text = variants({
  primary: PrimaryText,
  property: PropertyText,
  input: FakeInputText,
  default: BaseText,
  tag: Tag,
  button: ButtonText,
})
