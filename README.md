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
}
```

Tags are created while creating Tasks, but they should be stored separately since we will need to be able to fetch all tags for filtering + autocomplete.

Suggestions for tags:

- `home` - housework, both recurring tasks like chores and one-off tasks like "fix wobbly chair leg"
- `outdoors` - tasks which take place outside. useful for filtering since completion depends on weather and time of day
- `health` - exercise, taking vitamins, etc
- `logistics` - paying bills, shopping for household items, etc
- people or pets (parents, dog)

### Categories

```
Category {
  id: string
  name: string
}
```

Categories are one-to-many with completions (a completion can have a single category). These allow us to bucket completions for analytics purposes. A competion category can be anything, but the primary use case is to represent the person who completed it: eg, if a housekeeper has cleaned the bathroom, we can mark the "clean bathroom" task as completed with the `housekeeper` category, so that we can filter those completions out when we view analytics for work done ourselves.

### Tasks

```
Recurrence {
  frequency: enum (day, week, month, year)
  interval: integer
}

Task {
  id
  name: string
  description: string
  createdAt: date
  isRecurring: boolean
  recurrence: Recurrence
  deadline: timestamp
  deadlineWarning: Recurrence
  scheduled: timestamp
  points: integer
  tags: Tag[]
  priority: positive or negative integer (0 is neutral)
}
```

Constraints:

- `points` must be a positive integer
- `recurrence` is required if `isRecurring` is true
- `scheduled` and `deadline` are mutually exclusive, if one is set the other must be null
- if `isRecurring` is true then one of `scheduled` or `deadline` must be set, else both are optional
- `deadlineWarning` is required if `deadline` is set

#### Recurring tasks

Recurrences are defined by a frequency (representing days/weeks/months) and a numeric interval represeting how many of those days/weeks/months should elapse before it's time to do the task again.

For our use case it should be sufficient to reset the interval whenever the task is completed, meaning we mutate `scheduled` or `deadline` on the task record when that happens.

Generally recurring tasks will have scheduled dates, but theoretically they could have deadlines (eg, pay a bill that can't be automated), so we should also support that case.

#### Recurrence schema

This will be used for date math on the current date / scheduled date. Thus if we represent it in the db as `frequency` + `interval`, we will have to convert it to a duration we can pass to a date-time library, eg `{ weeks: 2 }`. We may want to just save it as a Duration in the first place, especially if using redux.

#### Deadlines and scheduled times

Taking a page from org-mode, tasks can (optionally) have a scheduled time or a deadline.

A scheduled date is simply the date at which it becomes time to perform the task (or at least start thinking about it). The urgency of the task increases with time elapsed since the scheduled date. This design assumes that we don't need to worry about tasks before their scheduled date.

A deadline indicates that the task should be completed _before_ the date in question - thus we should surface tasks with deadlines well before the deadline. As the deadline for a task approaches, the task grows more urgent (as a function of its point value) and therefore should be displayed more prominently (ie higher up) in the task list when using "smart" sorting.

### Completions

```
Completion: {
  taskId: string
  date: date
  points: number
  isPartial: boolean
  category: string
}
```

Completions are many-to-one with Tasks. The `points` value of a completion can be different from the point value of the parent task.

When creating a completion, inputs for `points` and `date` should default to the point value of the task and the current date respectively, but should be configurable in the UI.

#### Partial completions

A completion typically but not necessarily indicates that we should mark the task as "completed", meaning we reset its scheduled time or deadline if it is recurring

### Settings

- theme
- default deadline warning
- default number of points (or "none" to start blank)

#### On timezone

Setting a configurable timezone means we need to either:

1. do all date math in that timezone explicitly
2. set the system time to that timezone when the app starts up

it may in fact be smarter to just not make the timezone configurable.

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
