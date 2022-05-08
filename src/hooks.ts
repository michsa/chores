import { useState } from 'react'
import {
  TypedUseSelectorHook,
  useDispatch as baseUseDispatch,
  useSelector as baseUseSelector,
} from 'react-redux'
import type { State, Dispatch } from './redux/store'

export const useDispatch = () => baseUseDispatch<Dispatch>()
export const useStateSelector: TypedUseSelectorHook<State> = baseUseSelector

export const useSelector = <A extends any[], R>(
  selector: (state: State, ...rest: A) => R,
  ...rest: A
) => useStateSelector(state => selector(state, ...rest))

export const useForm = <T extends { [k: string]: any }>(defaults: T) => {
  const [form, setForm] = useState<T>(defaults)
  return {
    form,
    // both ramda and lodash curries have insufficient type support, oh well
    setField:
      <K extends keyof T>(key: K) =>
      (value: T[K]) => {
        console.log(`setField`, { [key]: value })
        setForm(currentForm => ({ ...currentForm, [key]: value }))
      }
  }
}
