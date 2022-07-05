import React from 'react'
import { TaskSettings } from '../types'
import { Row, Text, Icon } from '.'

export const PointsRemaining = ({
  settings,
  runningPoints,
}: {
  settings: TaskSettings
  runningPoints: number
}) => {
  if (settings.type === 'bucket') {
    return <Icon name="archive" size="small" color="primaryText" />
  }
  const pointsRemaining = settings.points - (runningPoints ?? 0)
  return (
    <Row as={Text} spacing="xs">
      <Text variant="primary">{pointsRemaining}</Text>
      {runningPoints > 0 && <Text>/</Text>}
      {runningPoints > 0 && <Text>{settings.points}</Text>}
    </Row>
  )
}
export default PointsRemaining
