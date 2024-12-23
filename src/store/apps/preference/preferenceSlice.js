import { createSlice } from '@reduxjs/toolkit'
import Colors from 'src/data/colors'

const initialState = {
  chartColor: { name: 'Blue', colors: Colors.Blue }
}

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setChartColor: (state, action) => {
      state.chartColor = action.payload
    }
  }
})

export const { setChartColor } = preferenceSlice.actions

export const getChartColor = state => state.preference.chartColor

export default preferenceSlice.reducer
