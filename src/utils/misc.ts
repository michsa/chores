import { getLuminance, mix } from 'polished'
import { Theme } from '../theme'
import { times } from 'lodash'

export const exists = <T>(x: T | undefined): x is T => !!x

export const readableText = (theme: Theme, color: keyof Theme['colors']) => {
  const lightText = theme.isDark ? 'primaryText' : 'headerBackground'
  const darkText = theme.isDark ? 'headerBackground' : 'primaryText'
  return getLuminance(theme.colors[color]) > 0.5 ? darkText : lightText
}

export const gradient = (n: number, start: string, end: string) => {
  const step = 1 / n
  return times(n, i => mix(1 - step * i, start, end))
}

export const maybePlural = (text: string, qty: number) =>
  qty === 1 ? text : `${text}s`
