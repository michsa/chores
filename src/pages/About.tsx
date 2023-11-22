import React from 'react'
import { ScrollView } from 'react-native'
import { SpacedList, Text, Row } from '../components'

const About = () => (
    <SpacedList as={ScrollView}>
      <Row>
        <Text variant="property">About</Text>
        
      </Row>
    </SpacedList>
  )

export default About
