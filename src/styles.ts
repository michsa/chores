import { ReactNativeStyle } from '@emotion/native'
import { Theme } from './theme'

export const inputStyle = ({ theme }: { theme: Theme }): ReactNativeStyle => ({
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.underline,
  paddingBottom: 2,
  fontSize: theme.fontSizes.regular,
  marginTop: -theme.spacing.s,
  paddingHorizontal: theme.spacing.s,
  height: theme.sizes.inputHeight,
  color: theme.colors.primaryText,
})
