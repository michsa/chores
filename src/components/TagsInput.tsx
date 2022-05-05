import React, { useEffect, useState, ComponentProps, useRef } from 'react'
import { View, Pressable, Modal } from 'react-native'
import { useTheme } from '@emotion/react'

import { useSelector } from '../hooks'
import { getTags } from '../redux/selectors'
import { TextInput, Text, Card } from '.'

const useSelectedTags = (initial: string[]) => {
  const [selectedTags, setSelectedTags] = useState(initial)
  const selectTag = (tag: string) =>
    setSelectedTags(current => [...current.slice(0, -1), tag, ''])

  return { selectedTags, selectTag, setSelectedTags }
}

export type TagsInputProps = Omit<ComponentProps<typeof TextInput>, 'value'> & {
  value: string[]
  onUpdate: (tags: string[]) => void
}

export const TagsInput = ({ value, onUpdate, ...props }: TagsInputProps) => {
  const theme = useTheme()
  const tags = useSelector(getTags)

  const { selectedTags, selectTag, setSelectedTags } = useSelectedTags(value)
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => onUpdate(selectedTags), [selectedTags])

  const ref = useRef(null)

  return (
    <View style={{ zIndex: 1, flex: 1 }} {...props}>
      <TextInput
        placeholder="Tags"
        value={selectedTags.join(' ')}
        onChangeText={text => setSelectedTags(text.split(' '))}
        onFocus={() => setDropdown(true)}
        onEndEditing={() => setDropdown(false)}
      />
      <Card
        style={{
          zIndex: 1,
          position: 'absolute',
          top: '100%',
          marginTop: theme.spacing.xs,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.underline,
          borderBottomColor: '#f0f',
          borderBottomWidth: 5,
          display: dropdown ? 'flex' : 'none',
          maxHeight: 200,
          overflow: 'hidden',
        }}>
        <View>
          {/* <FlatList
            scrollEnabled={false}
            // this is the trick to select a tag from the dropdown without blurring the text input
            keyboardShouldPersistTaps="handled"
            onScroll={() => console.log('flatList scroll')}
            // onTouchStart={() => console.log('touch start ')}
            scrollToOverflowEnabled
            data={tags.filter(tag => {
              const input = selectedTags[selectedTags.length - 1] ?? ''
              const matchesInput = tag.name.startsWith(input)
              return !selectedTags.includes(tag.name) && matchesInput
            })}
            renderItem={({ item: tag }) => (
              <Pressable onPress={() => selectTag(tag.name)}>
                <Text variant="property">{tag.name}</Text>
              </Pressable>
            )}
          /> */}
          {tags
            .filter(tag => {
              const input = selectedTags[selectedTags.length - 1] ?? ''
              const matchesInput = tag.name.startsWith(input)
              return !selectedTags.includes(tag.name) && matchesInput
            })
            .map(tag => (
              <Pressable onPress={() => selectTag(tag.name)} key={tag.id}>
                <Text variant="property">{tag.name}</Text>
              </Pressable>
            ))}
        </View>
      </Card>
    </View>
  )
}

export default TagsInput
