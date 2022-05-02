import '@emotion/react'
import '@reduxjs/toolkit'
import { Theme as AppTheme } from './theme'

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}

declare module '@reduxjs/toolkit' {
  export interface DictionaryNum<T> {
    [id: number]: T
  }
  export interface Dictionary<T> extends DictionaryNum<T> {
    [id: string]: T
  }
}
