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

export const Tag = styled.Text<{ color?: string }>(({ theme, color }) => ({
  backgroundColor: color ?? theme.colors.underline,
  color: theme.colors.primaryText,
  paddingHorizontal: theme.spacing.m,
  paddingVertical: theme.spacing.xs,
  borderRadius: theme.spacing.s,
}))

export const FakeInputText = styled.Text(({ theme }) => [
  inputStyle,
  {
    paddingBottom: theme.spacing.s,
    paddingTop: theme.spacing.l,
    fontSize: theme.spacing.l,
  },
])

export const Text = variants({
  primary: PrimaryText,
  property: PropertyText,
  input: FakeInputText,
  default: BaseText,
  tag: Tag,
})
