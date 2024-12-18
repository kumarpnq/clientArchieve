import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const now = dayjs('2024-11-10') // Current date and time
// const oneDayBefore = now.subtract(1, 'day') // Subtract one day
const oneDayBefore = dayjs('2024-10-01') // Subtract one day

const initialState = {
  companyIds: '',
  editionType: '',
  media: '',
  publication: '',
  geography: '',
  language: '',
  prominence: '',
  tonality: '',
  theme: '',
  articleSize: '',
  tags: '',
  mediaType: 'All',
  date: { from: oneDayBefore, to: now }
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState
    },
    updateFilters: (state, action) => {
      const { type, payload } = action.payload

      if (type in state) {
        state[type] = payload
      } else {
        console.warn('Invalid field type: ' + type)
      }
    },
    setDateTo: (state, action) => {
      state.date.to = action.payload
    },
    setDateFrom: (state, action) => {
      state.date.from = action.payload
    },
    setMediaType: (state, action) => {
      state.mediaType = action.payload
    }
  }
})

export const { updateFilters, setInitialState, setMediaType, setDateFrom, setDateTo } = filterSlice.actions

export const getMediaType = state => state.filter.mediaType

export const getDateRange = state => state.filter.date

export default filterSlice.reducer
