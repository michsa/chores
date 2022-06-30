import React from 'react'
import { Task, TaskSettings } from '../types'
import { Row, Text, Icon } from '.'

export const PointsRemaining = ({
  settings,
  runningPoints,
}: {
  settings: TaskSettings
  runningPoints: number
}) => {
  if (!('points' in settings)) {
    return (
      <Icon
        name="archive"
        size="small"
        color="primaryText"
        style={{ paddingVertical: 8 }}
      />
    )
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
