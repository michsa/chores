import React from 'react'
import { Task } from '../types'
import { Row, Text } from '.'

export const PointsRemaining = ({ task }: { task: Task }) => {
  const pointsRemaining = task.settings.points - (task.runningPoints ?? 0)
  return (
    <Row as={Text} spacing="xs">
      <Text variant="primary">{pointsRemaining}</Text>
      {task.runningPoints > 0 && <Text>/</Text>}
      {task.runningPoints > 0 && (
        <Text size="regular">{task.settings.points}</Text>
      )}
    </Row>
  )
}
export default PointsRemaining
