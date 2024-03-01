// userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    selectedClient: null,
    selectedCompetitions: [],
    selectedStartDate: null,
    selectedEndDate: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload
    },
    setSelectedCompetitions: (state, action) => {
      state.selectedCompetitions = action.payload
    },
    setSelectedDateRange: (state, action) => {
      state.selectedStartDate = action.payload.startDate
      state.selectedEndDate = action.payload.endDate
    },
    clearUserData: state => {
      state.data = null
      state.selectedClient = null
    }
  }
})

export const { setUserData, setSelectedClient, setSelectedCompetitions, setSelectedDateRange, clearUserData } =
  userSlice.actions

export const selectUserData = state => state.user.data

export const selectSelectedClient = state => state.user.selectedClient

export const selectSelectedCompetitions = state => state.user.selectedCompetitions

export const selectSelectedStartDate = state => state.user.selectedStartDate

export const selectSelectedEndDate = state => state.user.selectedEndDate

export default userSlice.reducer
