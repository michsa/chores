import { reduce } from 'lodash'
import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { FilterConfig, Filter } from '../../types'
import { State } from '../store'

const defaultFilters: { [k: string]: FilterConfig[] } = {
  recurring: [
    {
      type: ['recurring'],
      scheduledAt: [undefined, undefined], // scheduled before now
    },
  ],
  todos: [{ type: ['once'], isCompleted: false }],
  buckets: [{ type: ['bucket'] }],
  upcoming: [
    {
      type: ['recurring'],
      scheduledAt: [undefined, undefined], // scheduled after now
    },
  ],
  completed: [{ type: ['once'], isCompleted: true }],
  all: [],
}

const filtersAdapter = createEntityAdapter<Filter>({
  sortComparer: (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
})

const initialState = filtersAdapter.getInitialState(
  reduce(
    defaultFilters,
    (res, configs, name) => {
      const id = `_${name}`
      return {
        ...res,
        ids: [...res.ids, id],
        entities: { ...res.entities, [id]: { id, name, configs } },
      }
    },
    { ids: [], entities: {} } as EntityState<Filter>
  )
)

const tasks = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    add: filtersAdapter.addOne,
    remove: filtersAdapter.removeOne,
    update: filtersAdapter.updateOne,
    upsert: filtersAdapter.upsertOne,
    upsertMany: filtersAdapter.upsertMany,
  },
})

const selectors = filtersAdapter.getSelectors((state: State) => state.filters)

const { reducer, actions } = tasks
export { reducer, actions, selectors }
