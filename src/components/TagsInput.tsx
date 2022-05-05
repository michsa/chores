import React, { useEffect, useState, ComponentProps } from 'react'
import { View, Pressable, FlatList } from 'react-native'
import { useTheme } from '@emotion/react'

import { useSelector } from '../hooks'
import { getTags } from '../redux/selectors'
import { TextInput, Tag, Spacer } from '.'

export type TagsInputProps = Omit<ComponentProps<typeof TextInput>, 'value'> & {
  value: string[]
  onUpdate: (tags: string[]) => void
}

const useSelectedTags = (initial: string[]) => {
  const [selectedTags, setSelectedTags] = useState(initial)
  const selectTag = (tag: string) =>
    setSelectedTags(current => [...current.slice(0, -1), tag, ''])

  return { selectedTags, selectTag, setSelectedTags }
}

export const TagsInput = ({ value, onUpdate, ...props }: TagsInputProps) => {
  const theme = useTheme()
  const tags = useSelector(getTags)

  const { selectedTags, selectTag, setSelectedTags } = useSelectedTags(value)
  const [tagList, setTaglist] = useState(false)

  useEffect(() => onUpdate(selectedTags), [selectedTags])

  return (
    <View {...props}>
      <TextInput
        placeholder="Tags"
        value={selectedTags.join(' ')}
        onChangeText={text => setSelectedTags(text.split(' '))}
        onFocus={() => setTaglist(true)}
        onEndEditing={() => setTaglist(false)}
      />
      <FlatList
        style={{
          marginTop: theme.spacing.m,
          marginBottom: theme.spacing.s,
          display: tagList ? 'flex' : 'none',
        }}
        horizontal
        // this is the trick to select a tag from the dropdown without blurring the text input
        keyboardShouldPersistTaps="handled"
        data={tags.filter(tag => {
          const input = selectedTags[selectedTags.length - 1] ?? ''
          const matchesInput = tag.name.startsWith(input)
          return !selectedTags.includes(tag.name) && matchesInput
        })}
        ItemSeparatorComponent={Spacer}
        renderItem={({ item: tag }) => (
          <Pressable onPress={() => selectTag(tag.name)}>
            <Tag
              style={{
                backgroundColor: theme.colors.underline,
                color: theme.colors.primaryText,
                paddingHorizontal: theme.spacing.s,
                paddingVertical: theme.spacing.xs,
                borderRadius: 4,
              }}>
              {tag.name}
            </Tag>
          </Pressable>
        )}
      />
      {/* <Row style={{ flexWrap: 'wrap' }}>
        {tags
          .filter(tag => {
            const input = selectedTags[selectedTags.length - 1] ?? ''
            const matchesInput = tag.name.startsWith(input)
            return !selectedTags.includes(tag.name) && matchesInput
          })
          .map(tag => (
            <Pressable onPress={() => selectTag(tag.name)} key={tag.id}>
              <Card
                style={{
                  backgroundColor: theme.colors.background,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginVertical: 2,
                }}>
                <Text>{tag.name}</Text>
              </Card>
            </Pressable>
          ))}
      </Row> */}
    </View>
  )
}

export default TagsInput
