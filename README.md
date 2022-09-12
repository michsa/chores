# Chores

Android app about managing personal tasks, using react-native. This app primarily targets Android 9 since that's the version my phone uses, but it would be nice to polish & test it for newer versions and maybe even iOS.

The goal is to get personal tasks done in a timely manner. We approach this from two directions:

1. Task list: keep track of things to do in a format that encourages actually doing them. Default ordering that emphasizes the most important (or most useful) tasks. Track both recurring tasks and one-off tasks within the same interface. Filtering controls to facilitate finding existing tasks in order to complete them.
2. Metrics: track task completion & effort spent over time. This encourages actually using the app and also works a reward mechanism. (Recurring personal tasks - chores - can be frustrating because they're never actually "done". Keeping a record of work completed at least ensures that it is not forgotten.)

## Schemas

### Tags

```
Tag {
  id: string
  name: string
  color: string
  priority: integer
}
```

Tags are created while creating Tasks, but they should be stored separately since we will need to be able to fetch all tags for filtering + autocomplete.

Suggestions for tags:

- `home` - housework, both recurring tasks like chores and one-off tasks like "fix wobbly chair leg"
- `outdoors` - tasks which take place outside. useful for filtering since completion depends on weather and time of day
- `health` - exercise, taking vitamins, etc
- `shopping` - tasks that involve buying stuff
- people or pets (`parents`, `dog`, etc)

Customizing the `priority` of a tag is a nice-to-have. This would factor into task urgency in a similar way to the priority of the task itself.

### Tasks

(See [src/types/task.ts](./src/types/task.ts))

```
Task {
  id
  settings: TaskSettings
  createdAt: integer (timestamp)
  tagIds: string[]
  completionIds: string[]
  runningPoints: integer
}

TaskSettings {
  name: string
  type: 'recurring' | 'once' | 'bucket'
  points: integer
  priority: integer from -2 to 2 (0 is neutral)
  interval?: Interval
  deadline?: DateTime
  deadlineWarning?: Interval
  scheduled?: DateTime
  notes?: string
}

Interval {
  frequency: enum (day, week, month, year)
  count: integer
}

DateTime {
  date: [int, int, int] // year, month, day
  time?: [int, int] // hour, minute
}
```

Constraints:

- `points` must be a positive integer
- `recurrence` is required if `type` is `recurring`
- `scheduled` and `deadline` are mutually exclusive, if one is set the other must be null
- if `type` is `recurring` then one of `scheduled` or `deadline` must be set
- if `type` is `once` then both are optional
- it `type` is `bucket` then both must be null
- `deadlineWarning` is required if `deadline` is set

#### Bucket tasks

A bucket is a task that isn't ever really "finished", but is just something you dump points into on a regular basis - eg, taking out the trash, or tidying up. Bucket tasks repurpose the `points` and `interval` fields to indicate the "size" of the bucket in points-per-interval (eg, 5 points every 2 weeks).

#### Recurring tasks

Recurring tasks require an `interval`. This is essentially a duration (`frequency` denotes days/weeks/months and `count` determines how many), and the interval of a task represents how often the task needs to be done.

For our use case it should be sufficient to reset the interval whenever the task is completed, meaning we mutate `scheduled` or `deadline` on the task record when that happens.

Generally recurring tasks will have scheduled dates, but theoretically they could have deadlines (eg, pay a bill that can't be automated), so we should also support that case.

#### DateTime schema

For scheduling tasks, time of day is mostly irrelevant so it should be optional. Thus instead of saving a regular timestamp, we save times as objects with a required date property and an optional time property. When converting these to timestamps for date math, we use a default time (eventually configurable, set to 12pm for now) for values which don't have a time set.

#### Deadlines and scheduled times

Taking a page from org-mode, tasks can (optionally) have a scheduled time or a deadline.

A scheduled date is simply the date at which it becomes time to perform the task (or at least start thinking about it). The urgency of the task increases with time elapsed since the scheduled date. This design assumes that we don't need to worry about tasks before their scheduled date.

A deadline indicates that the task should be completed _before_ the date in question - thus we should surface tasks with deadlines well before the deadline. As the deadline for a task approaches, the task grows more urgent (as a function of its point value) and therefore should be displayed more prominently (ie higher up) in the task list when using "smart" sorting.

### Completions

```
Completion: {
  taskId: string
  date: DateTime
  points: number
  isPartial: boolean
  category: string
}
```

Completions are many-to-one with Tasks. The `points` value of a completion can be different from the point value of the parent task.

When creating a completion, inputs for `points` and `date` should default to the point value of the task and the current date respectively, but should be configurable in the UI.

#### Partial completions

A completion typically but not necessarily indicates that we should mark the task as "completed", meaning we reset its scheduled time or deadline if it is recurring, and represent it in the task list as having been completed.

### Categories

```
Category {
  id: string
  name: string
}
```

(Note: this is low priority)

Categories are one-to-many with completions (a completion can have a single category). These allow us to bucket completions for analytics purposes. A competion category can be anything, but the primary use case is to represent the person who completed it: eg, if a housekeeper has cleaned the bathroom, we can mark the "clean bathroom" task as completed with the `housekeeper` category, so that we can filter those completions out when we view analytics for work done ourselves.

### Settings

- theme
- default deadline warning
- default number of points (or "none" to start blank)
- tweak urgency scaling
- tag manager
- completion categories

## Filtering & sorting

We need a datastore that is really flexible about querying, since we should be able to build clauses dynamically based on filters.

Eg:

```ts
const getSortedAndFilteredTasks = (
  state: State,
  ...filters: ((task: Task) => boolean)[]
) => state.tasks.filter(compose(...filters))
```

where `filters` would be something like:

```ts
const isActive = task =>
  task.scheduled < new Date() ||
  sub(task.deadline, deadlineWarning) < new Date()

const isNotCompleted = task =>
  (!task.isRecurring && !task.lastCompletedAt) ||
  (task.isRecurring && isActive(task))
```

### Filter options

By default the task list should filter out completed tasks.

One-offs are completed if there exists any completion record for them with `isPartial = false`. A recurring task is considered completed (temporarily) when `scheduled` is in the future, or when the current date is before `deadline` minus `deadlineWarning`.

Other filter options:

- text search (probably just task name)
- tags: include and exclude
- priority
- scheduled
- deadline
- recurring or one-off
- completed or not completed
- point value range - a double-sided slider would be nice here

### Sorting

#### Urgency

The urgency of a task is a function of its priority and the time between the current time and the scheduled time or deadline.

Note that some tasks will not (and should not) have scheduled times or deadlines. These tasks should probably be handled as though they are of a lower priority than scheduled/deadline tasks.

How do we weigh time past scheduled date or time until deadline against priority?

Task size should factor into the time until deadline weight - larger tasks become more urgent near their deadline than smaller tasks because it is assumed that they will take longer to finish.

#### Utility

The "utility" of a task is a function of its urgency and the inverse of its point value (smaller tasks lead to higher utility).

#### Other sorting

- Priority
- Scheduled/deadline
- Age?
- Alphabetical

## Metrics

### Point totals

1. A line graph of time on the x axis and points completed on the y axis
2. A histogram of times completed (like activity on github)

Point totals can apply to one or more tasks. The default metrics view should show point totals for all tasks; the detail page for an individual task should link to point totals for that task.

Can filter and bucket by task properties. Grouping would work for any exclusive category (eg, recurring vs one-off since a task cannot be both, or priority - not tags since tasks can have multiple).

### Point averages

Average points completed per day over each week. Intervals can be customized, eg points per week over the last month/year, etc.

Can represent with a line graph or histogram just like with point totals, and can be filtered/bucketed along the same lines.

### Task demographics

Pie charts of all tasks broken down along various axes.

### Completion intervals

We have the data to compare the average completion interval (time between completions) against the recurrence interval for a task. Not sure how to represent this though.
