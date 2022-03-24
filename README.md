# Chores

Android app about managing personal tasks.

Goals:
- Keep track of things to do in a format that encourages actually completing tasks in a timely manner
- Present metrics of work done

## Schemas

### Tags

```
Tag {
  name: string
}
```

Tags are created while creating Tasks, but they should be stored separately since we will need to be able to fetch all tags for filtering + autocomplete.

Suggestions for tags:
- `home` - housework, both recurring tasks like chores and 
- `outdoors`
- `health`

### Tasks

```
Recurrence {
  frequency: enum (day, week, month)
  interval: integer
}

Task {
  id
  name: string
  description: string
  icon: emoji
  createdAt: date
  isRecurring: boolean
  recurrence: Recurrence
  deadline: timestamp
  (maybe) deadlineWarning: Recurrence
  scheduled: timestamp
  points: integer
  lastCompletedAt: date
  tags: Tag[]
  priority: positive or negative integer (0 is neutral)
}
```

Constraints:
- `points` must be a positive integer
- `recurrence` is required if `isRecurring` is true
- `scheduled` and `deadline` are mutually exclusive, if one is set the other must be null
- if `isRecurring` is true then one of `scheduled` or `deadline` must be set, else both are optional

#### Recurring tasks

Recurrences are defined by a frequency (representing days/weeks/months) and a numeric interval represeting how many of those days/weeks/months should elapse before it's time to do the task again.

For our use case it should be sufficient to reset the interval whenever the task is (fully) completed, meaning we mutate `scheduled` on the task record when that happens.

Generally recurring tasks will have scheduled dates, but theoretically they could have deadlines (eg, pay a bill that can't be automated), so we should also support that case.

#### Deadlines and scheduled times

Taking a page from org-mode, tasks can (optionally) have a scheduled time or a deadline.

A scheduled date is simply the date at which it becomes time to perform the task (or at least start thinking about it). The urgency of the task increases with time elapsed since the scheduled date. By default we don't need to worry about tasks before their scheduled date.

A deadline indicates that the task should be completed _before_ the date in question - thus we should surface tasks with deadlines well before the deadline. As the deadline for a task approaches, the task grows more urgent (as a function of its point value) and therefore should be displayed more prominently (ie higher up) in the task list when using "smart" sorting.

### Completions

```
Completion: {
  taskId
  date
  points
}
```

Completions are many-to-one with Tasks. The `points` value of a completion can be less than or equal to the point value of the parent task (ie, it's possible to partially complete a task).

When creating a completion, inputs for `points` and `date` should default to the point value of the task and the current date respectively, but should be configurable in the UI.

### Settings

- timezone: necessary for chunking metrics by day/week
- theme
- default deadline warning

## Filtering & sorting

### Filter options

By default the task list should filter out completed tasks.

One-offs are completed if there exists any completion record for them. A recurring task is considered completed (temporarily) when `scheduled` is in the future, or when the current date is before `deadline` minus `deadlineWarning`.

- include tags
- exclude tags
- text search (probably just task name)
- recurring or one-off
- completed or not completed
- point value range - a double-sided slider would be nice here
- priority range - also double-sided slider
- scheduled
- deadline

### Sorting

#### Urgency

The urgency of a task is a function of its priority and the time between the current time and the scheduled time or deadline.

#### Utility

The "utility" of a task is a function of its urgency and the inverse of its point value (smaller tasks lead to higher utility).

#### Other sorting

- Priority
- Scheduled/deadline
- Age?
- Alphabetical

## Metrics