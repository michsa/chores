import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Pressable, FlatList, View } from 'react-native'
import { useTheme } from '@emotion/react'
import { without } from 'lodash'

import { Icon, Row, SpacedList } from '../components'
import TagList from '../components/TagList'
import Picker, { PickerContainer } from '../components/Picker'
import { useSelector } from '../hooks'
import { getTags } from '../redux/selectors'

export type TagPickerProps = {
  value: string[]
  onChange: (tags: string[]) => void
}
const TagPicker = ({ value, onChange }: TagPickerProps) => {
  const theme = useTheme()
  const tags = useSelector(getTags)
  const [selected, setSelected] = useState<string[]>(value)

  const tagOptions = tags
    .filter(tag => !selected.includes(tag.id))
    .map(({ id, name }) => ({ label: name, value: id }))

  useEffect(() => onChange(selected), [selected])

  return (
    <Row>
      <Icon name="tag" />
      <View
        style={{
          flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.underline,
          paddingBottom: theme.spacing.xs
        }}>
        <TagList
          tags={tags.filter(tag => selected.includes(tag.id))}
          onPressTag={tag =>
            setSelected(currentTags => without(currentTags, tag.id))
          }>
          <Picker
            containerStyle={{
              borderBottomWidth: 0,
              flexShrink: 1,
              height: theme.sizes.buttonHeight,
              minWidth: theme.iconSizes.regular
            }}
            options={[{ label: '', value: '' }, ...tagOptions]}
            onValueChange={tag => {
              tag && setSelected(currentTags => [...currentTags, tag])
              console.log({ tag, selected })
            }}
          />
        </TagList>
      </View>
    </Row>
  )
}
export default TagPicker
