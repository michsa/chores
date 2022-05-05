import { ReactNativeStyle } from '@emotion/native'
import { Theme } from './theme'

export const inputStyle = ({ theme }: { theme: Theme }): ReactNativeStyle => ({
  marginTop: -theme.spacing.s,
  paddingHorizontal: theme.spacing.s,
  paddingBottom: 2,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.underline,
  fontSize: theme.fontSizes.regular,
  height: theme.sizes.inputHeight,
  color: theme.colors.primaryText,
})
