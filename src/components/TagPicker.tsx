import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from '@emotion/react'
import { without } from 'lodash'

import { Icon, Row, IconButton } from '../components'
import TagList from '../components/TagList'
import Picker from '../components/Picker'
import { useSelector } from '../hooks'
import { getTags } from '../redux/selectors'

export type TagPickerProps = {
  value: string[]
  onChange: (tags: string[]) => void
  icon?: string
  excludeTags?: string[]
  placeholderText?: string
}
const TagPicker = ({
  value,
  onChange,
  icon = 'tag',
  excludeTags = [],
  placeholderText = 'Select tags...',
}: TagPickerProps) => {
  const theme = useTheme()
  const tags = useSelector(getTags)
  const [selected, setSelected] = useState<string[]>(value)

  const tagOptions = tags
    .filter(tag => !selected.includes(tag.id) && !excludeTags.includes(tag.id))
    .map(({ id, name }) => ({ label: name, value: id }))

  useEffect(() => onChange(selected), [selected])

  return (
    <Row>
      <Icon name={icon} />
      <View
        style={{
          flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.underline,
          paddingBottom: theme.spacing.xs,
        }}>
        <TagList
          tags={tags.filter(tag => selected.includes(tag.id))}
          onPressTag={tag =>
            setSelected(currentTags => without(currentTags, tag.id))
          }>
          <Picker
            key="picker"
            containerStyle={{
              borderBottomWidth: 0,
              flexShrink: 1,
              height: theme.sizes.buttonHeight,
              minWidth: 100,
              zIndex: -1,
            }}
            style={{ color: theme.colors.placeholderText }}
            options={[{ label: placeholderText, value: '' }, ...tagOptions]}
            onValueChange={tag => {
              tag && setSelected(currentTags => [...currentTags, tag])
              console.log({ tag, selected })
            }}
          />
        </TagList>
      </View>
      <IconButton name="x" size="regular" onPress={() => setSelected([])} />
    </Row>
  )
}
export default TagPicker
