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
  tags: ''
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
    }
  }
})

export const { updateFilters, setInitialState } = filterSlice.actions

export default filterSlice.reducer
