import { getLuminance, mix } from 'polished'
import { Theme } from '../theme'
import { times, get } from 'lodash'

export const exists = <T>(x: T | undefined): x is T => !!x

/**
 * Returns a theme-appropriate readable text color for the input background
 * color (either `primaryText` or `headerBackground`).
 */
export const readableText = (theme: Theme, color: keyof Theme['colors'] | string) => {
  const lightText = theme.isDark ? 'primaryText' : 'headerBackground'
  const darkText = theme.isDark ? 'headerBackground' : 'primaryText'
  return getLuminance(get(theme.colors, color)) > 0.5 ? darkText : lightText
}

export const gradient = (n: number, start: string, end: string) => {
  const step = 1 / n
  return times(n, i => mix(1 - step * i, start, end))
}

export const maybePlural = (text: string, qty: number) =>
  qty === 1 ? text : `${text}s`

/* mapToObject transforms an array into an object with one key-value pair for each
 * element in the array. The second and third arguments are functions that get called
 * on each element in the array to determine its key and value in the result object.
 * If the value function is not passed, the value will be the entire element.
 *
 * eg, `mapToObject(participants, p => p.uuid, p => p.parentName)` generates a map of
 * participant uuids to the parentName of those participants.
 *
 * We overload the types so that it will type the return value properly, depending on
 * whether or not valueFn is passed.
 */
export function mapToObject<T, K extends string | number | symbol, R>(
  array: T[],
  keyFn: (x: T) => K,
  valueFn: (x: T) => R
): { [k in K]: R }
export function mapToObject<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (x: T) => K
): { [k in K]: T }
export function mapToObject<T, K extends string | number | symbol, R>(
  array: T[],
  keyFn: (x: T) => K,
  valueFn?: (x: T) => R
) {
  return valueFn
    ? mapToObjectWithValue<T, K, ReturnType<typeof valueFn>>(
        array,
        keyFn,
        valueFn
      )
    : mapToObjectWithValue<T, K, T>(array, keyFn, x => x)
}

function mapToObjectWithValue<T, K extends string | number | symbol, R>(
  array: T[],
  keyFn: (x: T) => K,
  valueFn: (x: T) => R
) {
  return array.reduce((acc, x) => {
    acc[keyFn(x)] = valueFn(x)
    return acc
  }, {} as { [k in K]: R })
}
