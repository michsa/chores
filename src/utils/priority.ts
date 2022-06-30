import { Priority, PriorityLabel } from '../types'

export const priorityMultiplerMapping = {
  [-2]: 0.5,
  [-1]: 0.75,
  [0]: 1,
  [1]: 1.5,
  [2]: 2,
}

export const priorityOptions: { label: PriorityLabel; value: Priority }[] = [
  { label: 'Highest', value: 2 },
  { label: 'High', value: 1 },
  { label: 'Standard', value: 0 },
  { label: 'Low', value: -1 },
  { label: 'Lowest', value: -2 },
]
const priorityLabels = priorityOptions.reduce((labels, option) => {
  labels[option.value] = option.label
  return labels
}, {} as { [k in Priority]: PriorityLabel })

export const priorityLabel = (p: Priority) => priorityLabels[p]

export const shortPriorityLabel = (p: Priority) =>
  `${p < 0 ? '−' : p > 0 ? '+' : ''}${Math.abs(p)}`
