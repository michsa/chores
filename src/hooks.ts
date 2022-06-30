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

export const useForm = <T extends { [k: string]: any }>(
  defaults: T,
  onSet: (form: T) => T = x => x
) => {
  const [form, setForm] = useState<T>(defaults)
  return {
    form,
    // both ramda and lodash curries have insufficient type support, oh well
    setField:
      <K extends keyof T>(key: K) =>
      (value: T[K]) => {
        setForm(onSet({ ...form, [key]: value }))
      },
  }
}

type FlagState<T extends string> = Partial<{ [k in T]: boolean }>

export const useFlags = <T extends string>(initialState: FlagState<T> = {}) => {
  const [state, setState] = useState<FlagState<T>>(initialState)

  return {
    isSet: (x: T) => !!state[x],
    toggle: (x: T) => setState(p => ({ ...p, [x]: !p[x] })),
  }
}
