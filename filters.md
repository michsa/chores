# Filters

Some notes on the current state and goals for filters.

`redux/filters` has a bunch of functions that operate on tasks. this is deprecated.

`FilterConfig` is the old component for filtering tasks, which uses the functions in `redux/filters`. this is deprecated because these filters aren't serializable.

`utils/filters` holds the new `FilterConfig` type, which is serializable, and a couple of hardcoded default filter configs which kinda suck because they currently can't be combined.

TODO:

- add a type `TaskFilter`, which has a name and an array of FilterConfigs. these are or'd together when filtering a task
- create a new `filter` state slice for TaskFilters (filters should live in state not in code, since they are supposed to be editable)
- update the `getFilteredTasks` selector to take an array of FilterConfigs (or an id pointing to a TaskFilter in state)
- add an `EditTaskFilter` component and an edit button next to the filter picker on `TaskList` which will render this component. (later, we should move filters under a hamburger menu and move the edit button to the title bar.)
  - from here you should be able to update the selected TaskFilter (save) or save the changes to a new TaskFilter - this should open a modal to enter a name for the new TaskFilter.

it would be nice to support nested TaskFilters, ie the filters array could contain either FilterConfigs or TaskFilters. however, we'd have to make sure to avoid circular dependencies here, so this is not a priority.