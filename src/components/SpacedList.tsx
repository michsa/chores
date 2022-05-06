import React, { ComponentType } from 'react'
import { ViewProps, View } from 'react-native'
import { Theme } from '../theme'
import { Spacer } from '.'

export type SpacedListProps<P extends ViewProps> = {
  as?: ComponentType<P> | React.ElementType
  spacing?: keyof Theme['spacing']
  spacer?: ComponentType<{ size?: keyof Theme['spacing'] }>
} & P

export const SpacedList = <P extends ViewProps>({
  spacing = 's',
  children,
  as = View,
  spacer = Spacer,
  ...props
}: SpacedListProps<P>) => {
  const Component = as
  const SpacerComponent = spacer
  return (
    <Component {...props}>
      {React.Children.toArray(children).map(
        (child, i) =>
          !!child && (
            <React.Fragment key={i}>
              {i > 0 && <SpacerComponent size={spacing} />}
              {child}
            </React.Fragment>
          )
      )}
    </Component>
  )
}
export default SpacedList

export const Row = <P extends ViewProps>({
  style,
  ...props
}: SpacedListProps<P>) => (
  <SpacedList
    style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
    {...props}
  />
)
