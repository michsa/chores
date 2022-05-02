import React, { ComponentType } from 'react'
import styled from '@emotion/native'
import { inputStyle } from '../styles'
import { variants } from './utils'

const BaseText = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.fontSizes.small,
}))

export const PrimaryText = styled.Text(({ theme }) => ({
  color: theme.colors.primaryText,
  fontSize: theme.fontSizes.regular,
}))

export const PropertyText = styled(PrimaryText)(({ theme }) => ({
  paddingVertical: theme.spacing.s,
}))

export const FakeInputText = styled.Text([
  inputStyle,
  {
    paddingBottom: 8,
    paddingTop: 16,
    fontSize: 16,
  },
])

export const Text = variants({
  primary: PrimaryText,
  property: PropertyText,
  input: FakeInputText,
  default: BaseText,
})
