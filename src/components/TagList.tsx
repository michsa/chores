import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@emotion/react'
import { Tag } from '../types'
import Text from './Text'

export type TagListProps = {
  tags: Tag[]
  variant?: 'default' | 'small'
  onPressTag?: (tag: Tag) => void
  children?: React.ReactNode
}
export const TagList = ({
  tags,
  variant = 'default',
  onPressTag,
  children,
}: TagListProps) => {
  const theme = useTheme()
  const spacing = theme.spacing.xxs
  return (
    <View
      style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        margin: -spacing,
      }}>
      {tags.map(t => (
        <View key={t.id}>
          <Text
            variant={variant === 'small' ? 'smallTag' : 'tag'}
            style={{ margin: spacing, flexGrow: 0 }}
            onPress={() => onPressTag?.(t)}>
            {t.name}
          </Text>
        </View>
      ))}
      {children}
    </View>
  )
}
export default TagList
