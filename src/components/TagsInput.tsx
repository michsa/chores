import React, { useEffect, useState, ComponentProps } from 'react'
import { Pressable, FlatList } from 'react-native'
import { useTheme } from '@emotion/react'

import { useSelector } from '../hooks'
import { getTags } from '../redux/selectors'
import { TextInput, Tag, Spacer, Card, Row, Icon, SpacedList } from '.'
import { exists } from '../utils'

export type TagsInputProps = Omit<ComponentProps<typeof TextInput>, 'value'> & {
  value: string[]
  onUpdate: (tags: string[]) => void
}

// we only store the names of selected tags. later, when saving, we will look
// up the tags by name. this makes it easier to handle combinations of existing
// and new tags, and prevents us from accidentally creating multiple tags with
// the same name.
const useSelectedTags = (initial: string[]) => {
  const tags = useSelector(getTags)
  const [selectedTags, setSelectedTags] = useState(initial)

  // the last element of the input is used as a search term to filter the list
  // of existing tags.
  const searchTerm = selectedTags[selectedTags.length - 1] ?? ''
  const matchingTags = tags.filter(tag => {
    const isMatch = tag.name.includes(searchTerm)
    return !selectedTags.includes(tag.name) && isMatch
  })
  // used when picking an existing tag from the list.
  // the selected tag replaces the last element of the input.
  const selectTag = (tag: string) =>
    setSelectedTags(current => [...current.slice(0, -1), tag, ''])

  return { selectedTags, matchingTags, selectTag, setSelectedTags }
}

export const TagsInput = ({ value, onUpdate, ...props }: TagsInputProps) => {
  const theme = useTheme()

  const { selectedTags, matchingTags, selectTag, setSelectedTags } =
    useSelectedTags(value)
  const [showTagList, setShowTagList] = useState(false)

  useEffect(
    () => onUpdate(selectedTags.map(tag => tag.trim()).filter(exists)),
    [selectedTags]
  )

  return (
    <SpacedList as={Card} {...props}>
      <Row>
        <Icon name="tag" />
        <TextInput
          style={{ flex: 1 }}
          placeholder="Tags"
          value={selectedTags.join(' ')}
          onChangeText={text => setSelectedTags(text.split(' '))}
          onFocus={() => setShowTagList(true)}
          onEndEditing={() => setShowTagList(false)}
        />
      </Row>
      {showTagList && matchingTags.length && (
        <Row spacing="m">
          <Icon size="small" name="book-open" />
          <FlatList
            style={{ paddingVertical: theme.spacing.xs }}
            showsHorizontalScrollIndicator
            horizontal
            // this is the trick to select a tag from the dropdown without blurring the text input
            keyboardShouldPersistTaps="handled"
            data={matchingTags}
            ItemSeparatorComponent={Spacer}
            renderItem={({ item: tag }) => (
              <Pressable onPress={() => selectTag(tag.name)}>
                <Tag>{tag.name}</Tag>
              </Pressable>
            )}
          />
        </Row>
      )}
    </SpacedList>
  )
}

export default TagsInput
