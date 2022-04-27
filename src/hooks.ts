import {
  TypedUseSelectorHook,
  useDispatch as baseUseDispatch,
  useSelector as baseUseSelector,
} from 'react-redux'
import type { State, Dispatch } from './redux/store'

export const useDispatch = () => baseUseDispatch<Dispatch>()
export const useSelector: TypedUseSelectorHook<State> = baseUseSelector
