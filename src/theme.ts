import { mapValues } from 'lodash'

const palette = {
  white: '#ffffff',
  offWhite: '#f2f2f2',

  // light text
  grey1: '#757575',
  grey2: '#8a8a8a',

  // underline colors
  grey3: '#d3d3d3',
  grey4: '#2c2c2c',

  // placeholder text
  grey5: '#9e9e9e',
  grey6: '#414141', // actual inverse of light mode: 616161

  black: '#000000',
  offBlack: '#0d0d0d',

  accent: 'teal',
  danger: 'indianred',
}

const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24
}

const sizes = {
  inputHeight: 46
}

const fontSizes = {
  small: 14,
  regular: 16,
  large: 20,
}

const iconSizes = {
  small: 16,
  regular: 20,
  large: 24,
  header: 24,
  xlarge: 26
}

type ThemeColor =
  | 'background'
  | 'foreground'
  | 'headerBackground'
  | 'text'
  | 'primaryText'
  | 'placeholderText'
  | 'underline'
  | 'accent'
  | 'danger'

type ColorScheme = { [k in ThemeColor]: string }

const highlightColors = {
  accent: palette.accent,
  danger: palette.danger,
}

const lightColors: ColorScheme = {
  ...highlightColors,
  background: palette.offWhite,
  foreground: palette.white,
  headerBackground: palette.white,
  text: palette.grey1,
  primaryText: palette.black,
  placeholderText: palette.grey5,
  underline: palette.grey3,
}

const darkColors: ColorScheme = {
  ...highlightColors,
  background: palette.black,
  foreground: palette.offBlack,
  headerBackground: palette.black,
  text: palette.grey2,
  primaryText: palette.offWhite,
  placeholderText: palette.grey6,
  underline: palette.grey6,
}

const baseTheme = {
  palette,
  spacing,
  sizes,
  fontSizes,
  iconSizes
}

export const darkTheme = {
  ...baseTheme,
  isDark: true,
  colors: darkColors
}

export const lightTheme = {
  ...baseTheme,
  isDark: false,
  colors: lightColors
}

export type Theme = typeof lightTheme & typeof darkTheme
