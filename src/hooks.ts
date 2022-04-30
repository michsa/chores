import { useState } from 'react'
import {
  TypedUseSelectorHook,
  useDispatch as baseUseDispatch,
  useSelector as baseUseSelector,
} from 'react-redux'
import type { State, Dispatch } from './redux/store'

export const useDispatch = () => baseUseDispatch<Dispatch>()
export const useSelector: TypedUseSelectorHook<State> = baseUseSelector

export const useForm = <T extends { [k: string]: unknown }>(defaults: T) => {
  const [form, setForm] = useState<T>(defaults)
  return {
    form,
    // both ramda and lodash curries have shoddy type support, oh well
    setField:
      <K extends keyof T>(key: K) =>
      (value: T[K]) => {
        console.log(`setField`, key, value)
        setForm(currentForm => ({ ...currentForm, [key]: value }))
      },
  }
}
