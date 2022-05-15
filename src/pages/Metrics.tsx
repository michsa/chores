import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import {
  VictoryLine,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryHistogram,
  Bar,
} from 'victory-native'
import { keyBy, groupBy } from 'lodash'
import { format, sub, startOfDay } from 'date-fns'

import { SpacedList, Text, Card, Row } from '../components'
import { useSelector } from '../hooks'
import { getCompletionsWithTasks } from '../redux/selectors'
import { toDate, clampDateTime, printDate } from '../utils'
import { Completion, CompletionWithTask, Recurrence, Frequency } from '../types'

const TEST_TAG = 'tag-test-1652406724046'

const data = [
  { date: toDate({ date: [2022, 1, 1] }), points: 1 },
  { date: toDate({ date: [2022, 1, 2] }), points: 2 },
  { date: toDate({ date: [2022, 1, 3] }), points: 1 },
  { date: toDate({ date: [2022, 1, 3] }), points: 3 },
]

const pointTotalsByFrequency = (completions: Completion[], freq?: Frequency) =>
  completions.reduce((acc, c) => {
    const clampedDate = clampDateTime(c.date, freq).valueOf()
    const points = c.points + (acc[clampedDate] ?? 0)
    acc[clampedDate] = points
    return acc
  }, {} as { [k: number]: number })

const pointTotalData = (completions: Completion[], freq?: Frequency) =>
  completions.reduce((acc, c) => {
    const clampedDate = clampDateTime(c.date, freq).valueOf()
    const points = c.points + (acc[clampedDate]?.y ?? 0)
    acc[clampedDate] = { y: points, x: new Date(clampedDate) }
    return acc
  }, {} as { [k: number]: { x: Date; y: number } })

const splitPoints = (c: Completion) =>
  Array(c.points).fill({ x: toDate(c.date) })

const App = () => {
  const completions = useSelector(getCompletionsWithTasks, [
    task => !task.tagIds.includes(TEST_TAG),
  ])
  const c = completions.map(c => ({
    // id: c.id,
    task: c.task.settings.name,
    date: toDate(c.date),
    points: c.points,
    isFull: c.isFull,
  }))

  return (
    <SpacedList as={ScrollView}>
      <Row>
        <Card style={{ flex: 1 }}>
          <Text variant="property">Full: {c.filter(c => c.isFull).length}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text variant="property">
            Partial: {c.filter(c => !c.isFull).length}
          </Text>
        </Card>
      </Row>
      <Card style={{ justifyContent: 'center', alignItems: 'center' }}>
        <VictoryChart
          scale={{ x: 'time', y: 'linear' }}
          width={400}
          theme={VictoryTheme.material}>
          {/* <VictoryAxis
          // tickFormat={(t: number) => format(t, 'MM/dd')}
          // minDomain={{
          //   x: startOfDay(sub(new Date(), { weeks: 2 })).valueOf(),
          // }}
          /> */}
          {/* <VictoryAxis dependentAxis /> */}
          {/* <VictoryBar data={Object.values(pointTotalData(completions))} /> */}
          <VictoryHistogram
            data={completions
              .filter(c => toDate(c.date) > sub(new Date(), { weeks: 2 }))
              .flatMap(splitPoints)}
            domain={{
              x: [
                sub(new Date(), { weeks: 1 }).valueOf(),
                new Date().valueOf(),
              ],
            }}
          />
        </VictoryChart>
      </Card>
      <Card>
        <Text variant="primary">completions</Text>
        <Text>{JSON.stringify(c, null, 2)}</Text>
      </Card>
      {/* <Card>
        <Text variant="primary">completions by date</Text>
        <Text>
          {JSON.stringify(
            groupBy(c, c => clampDateTime(c).valueOf()),
            null,
            2
          )}
        </Text>
      </Card> */}
      {/* <Card>
        <Text variant="primary">completions by date</Text>
        <Text>
          {JSON.stringify(
            pointTotalsByFrequency(completions, Frequency.DAY),
            null,
            2
          )}
        </Text>
      </Card> */}
      {/* <Card>
        <Text variant="primary">split by points</Text>
        <Text>
          {JSON.stringify(
            completions
              .filter(c => toDate(c.date) > sub(new Date(), { weeks: 2 }))
              .flatMap(splitPoints),
            null,
            2
          )}
        </Text>
      </Card> */}
      <Card>
        <Text variant="primary">data</Text>
        <Text>
          {JSON.stringify(Object.values(pointTotalData(completions)), null, 2)}
        </Text>
      </Card>
    </SpacedList>
  )
}
export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
