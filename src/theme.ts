const palette = {
  white: '#ffffff',
  offWhite: '#f2f2f2',

  grey0: '#e1e1e1',
  grey1: '#d3d3d3', // light underline
  grey2: '#9e9e9e', // light placeholder text
  grey3: '#8a8a8a', // dark secondary text
  grey4: '#757575', // light secondary text
  grey5: '#414141', // dark placeholder text (actual inverse of light mode: 616161)
  grey6: '#2c2c2c', // dark underline

  lightOffBlack: '#1d1d1d',
  offBlack: '#101010', // '#0d0d0d',
  black: '#000000',

  accent: 'teal',
  danger: 'indianred',
}

type ThemeColor =
  | 'background'
  | 'foreground'
  | 'headerBackground'
  | 'text'
  | 'primaryText'
  | 'placeholderText'
  | 'underline'
  | 'highlight'
  | 'accent'
  | 'danger'

type ColorScheme = { [k in ThemeColor]: string }

const highlightColors = {
  accent: palette.accent,
  danger: palette.danger,
}

const lightColors = {
  ...highlightColors,
  background: palette.offWhite,
  foreground: palette.white,
  headerBackground: palette.white,
  headerForeground: palette.offWhite,
  text: palette.grey4,
  primaryText: palette.black,
  placeholderText: palette.grey2,
  underline: palette.grey1,
  highlight: palette.grey0,
}

const darkColors = {
  ...highlightColors,
  background: palette.black,
  foreground: palette.offBlack,
  headerBackground: palette.black,
  headerForeground: palette.lightOffBlack,
  text: palette.grey3,
  primaryText: palette.offWhite,
  placeholderText: palette.grey5,
  underline: palette.grey5,
  highlight: palette.grey6,
}

const spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
}

const sizes = {
  inputHeight: 46,
  buttonHeight: 42,
  headerButtonHeight: 36,
}

const fontSizes = {
  small: 14,
  regular: 16,
  large: 20,
}

const iconSizes = {
  xsmall: 14,
  small: 16,
  regular: 20,
  large: 24,
  header: 24,
  xlarge: 26,
  xxlarge: 30, // for completion checkmarks
}

const baseTheme = {
  palette,
  spacing,
  sizes,
  fontSizes,
  iconSizes,
}

export const darkTheme = {
  ...baseTheme,
  isDark: true,
  colors: darkColors,
}

export const lightTheme = {
  ...baseTheme,
  isDark: false,
  colors: lightColors,
}

export type Theme = typeof lightTheme & typeof darkTheme
