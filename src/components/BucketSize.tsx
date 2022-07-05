import React from 'react'
import { BucketTaskSettings } from '../types'
import { printInterval } from '../utils'
import { Row, Text } from '.'

export const BucketSize = ({ points, interval }: BucketTaskSettings) => (
  <Row as={Text} spacing="xs">
    <Text variant="primary">{points}</Text>
    <Text>/</Text>
    <Text variant="primary">{printInterval(interval, false)}</Text>
  </Row>
)
export default BucketSize
