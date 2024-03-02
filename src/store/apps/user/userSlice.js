import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    selectedClient: null,
    selectedCompetitions: [],
    selectedStartDate: null,
    selectedEndDate: null,
    notificationFlag: false // Add the new state here
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
    setNotificationFlag: (state, action) => {
      state.notificationFlag = action.payload
    },
    clearUserData: state => {
      state.data = null
      state.selectedClient = null
      state.notificationFlag = false // Clear the flag when clearing user data
    }
  }
})

export const {
  setUserData,
  setSelectedClient,
  setSelectedCompetitions,
  setSelectedDateRange,
  setNotificationFlag, // Export the new action
  clearUserData
} = userSlice.actions

export const selectUserData = state => state.user.data

export const selectSelectedClient = state => state.user.selectedClient

export const selectSelectedCompetitions = state => state.user.selectedCompetitions

export const selectSelectedStartDate = state => state.user.selectedStartDate

export const selectSelectedEndDate = state => state.user.selectedEndDate

export const selectNotificationFlag = state => state.user.notificationFlag

export default userSlice.reducer
