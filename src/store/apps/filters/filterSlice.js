import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  company: '',
  editionType: '',
  media: '',
  publication: '',
  geography: '',
  language: '',
  prominence: '',
  tonality: '',
  theme: '',
  articleSize: '',
  tags: ''
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      const { type, payload } = action.payload
      if (type in state) {
        state[type] = payload
      } else {
        console.warn('Invalid field type: ' + type)
      }
    }
  }
})

export const { updateFilters } = filterSlice.actions

export default filterSlice.reducer
