import React, { ComponentType } from 'react'
import { ViewProps, View, ViewStyle } from 'react-native'
import { Theme } from '../theme'
import { Spacer } from '.'

export type SpacedListProps = ViewProps & {
  as?: ComponentType<ViewProps>
  spacing?: keyof Theme['spacing']
}

export const SpacedList = ({
  spacing = 's',
  children,
  as = View,
  ...props
}: SpacedListProps) => {
  const Component = as
  return (
    <Component {...props}>
      {React.Children.map(
        children,
        (child, i) =>
          !!child && (
            <>
              {child}
              {i + 1 < React.Children.count(children) && (
                <Spacer size={spacing} />
              )}
            </>
          )
      )}
    </Component>
  )
}
export default SpacedList

export const Row = ({ style, ...props }: SpacedListProps) => (
  <SpacedList
    style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
    {...props}
  />
)
