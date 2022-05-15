import React from 'react'
import { Task, TaskSettings } from '../types'
import { Row, Text } from '.'

export const PointsRemaining = ({
  settings,
  runningPoints,
}: {
  settings: TaskSettings
  runningPoints: number
}) => {
  const pointsRemaining = settings.points - (runningPoints ?? 0)
  console.log({ pointsRemaining })
  return (
    <Row as={Text} spacing="xs">
      <Text variant="primary">{pointsRemaining}</Text>
      {runningPoints > 0 && <Text>/</Text>}
      {runningPoints > 0 && <Text>{settings.points}</Text>}
    </Row>
  )
}
export default PointsRemaining
