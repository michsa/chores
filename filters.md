# Filters

Some notes on the current state and goals for filters.

`redux/slices/filters` holds the state slice for filters. an element in filter state is a `Filter` which contains one or more `FilterConfig`s.

a `FilterConfig` is a serializable object whose properties represent requirements for the task, eg `type`, `isCompleted`.

a `TaskFilter` is a function that takes a `Task` and returns a boolean.

`utils/filters` defines functions for converting `Filter`s and their `FilterConfig`s into `TaskFilter`s. we use these in `getFilteredTasks` in `redux/selectors`.

if a filter has multiple `FilterConfig`s, these are or'd together.


TODO:

- support `Interval`s in the `scheduledAt`/`lastCompletedAt` properties of `FilterConfig` in addition to (or instead of) `DateTime`s, so that we can define these relative to the current date.
- move the filter selector to a (new) `FilterControls` component.
  - add an edit button next to the picker which will render a form to edit the `Filter`.
    - `EditFilterConfig` - form with fields for each FilterConfig key
    - render one for each `FilterConfig` in the Filter, plus buttons to add/delete `FilterConfigs`
  - from here you should be able to update the selected `Filter` (save) or save the changes to a new `Filter` - this should open a modal to enter a name for the new `Filter`.

it would be nice to support nested `Filters`, ie the filters array could contain either `FilterConfig`s or `Filter`s/`FilterID`s. however, we'd have to do extra work to prevent infinite loops, so this is not a priority.
