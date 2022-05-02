import React, { ComponentType } from 'react'

export const variants =
<T, K extends string>(variantMapping: {
  [k in K]: ComponentType<T>
}) =>
({
  variant = 'default' as K,
  ...props
}: { variant?: keyof typeof variantMapping } & T) => {
  const Component = variantMapping[variant] as ComponentType<T>
  return <Component {...(props as T)} />
}
