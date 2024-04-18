import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    selectedClient: null,
    selectedCompetitions: [],
    selectedStartDate: null,
    selectedEndDate: null,
    notificationFlag: false,
    fetchAutoStatusFlag: false,
    selectedMedia: 'print'
    shotCutPrint: [],
    shortCutFlag: false
  },
  reducers: {
    setShotCutPrint: (state, action) => {
      state.shotCutPrint = action.payload
    },
    setShortCutFlag: (state, action) => {
      state.shortCutFlag = action.payload
    },
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
    setFetchAutoStatusFlag: (state, action) => {
      state.fetchAutoStatusFlag = action.payload
    },
    clearUserData: state => {
      state.data = null
      state.selectedClient = null
      state.notificationFlag = false
      state.fetchAutoStatusFlag = false
    },
    setSelectedMedia: (state, action) => {
      state.selectedMedia = action.payload
    }
  }
})

export const {
  setUserData,
  setSelectedClient,
  setSelectedCompetitions,
  setSelectedDateRange,
  setNotificationFlag,
  setFetchAutoStatusFlag,
  clearUserData,
  setSelectedMedia
  setFetchAutoStatusFlag, // Export the new action
  clearUserData,
  shotCutPrint,
  setShotCutPrint,
  shortCutFlag,
  setShortCutFlag
} = userSlice.actions

export const selectUserData = state => state.user.data

export const selectShortCut = state => state.user.shotCutPrint

export const selectShortCutFlag = state => state.user.shortCutFlag

export const selectSelectedClient = state => state.user.selectedClient

export const selectSelectedCompetitions = state => state.user.selectedCompetitions

export const selectSelectedStartDate = state => state.user.selectedStartDate

export const selectSelectedEndDate = state => state.user.selectedEndDate

export const selectNotificationFlag = state => state.user.notificationFlag

export const selectFetchAutoStatusFlag = state => state.user.fetchAutoStatusFlag

export const selectSelectedMedia = state => state.user.selectedMedia

export default userSlice.reducer
