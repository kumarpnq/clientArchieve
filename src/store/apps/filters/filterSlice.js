import { createSlice } from '@reduxjs/toolkit'

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
  mediaType: 'All'
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
    setMediaType: (state, action) => {
      state.mediaType = action.payload
    }
  }
})

export const { updateFilters, setInitialState, setMediaType } = filterSlice.actions

export const getMediaType = state => state.filter.mediaType

export default filterSlice.reducer
