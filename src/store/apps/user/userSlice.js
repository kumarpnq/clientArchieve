// userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    selectedClient: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload
    },
    clearUserData: state => {
      state.data = null
      state.selectedClient = null
    }
  }
})

export const { setUserData, setSelectedClient, clearUserData } = userSlice.actions

export const selectUserData = state => state.user.data

export const selectSelectedClient = state => state.user.selectedClient

export default userSlice.reducer
