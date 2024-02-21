// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import userReducer from 'src/store/apps/user/userSlice' // Update this import

export const store = configureStore({
  reducer: {
    chat,
    email,
    invoice,
    calendar,
    permissions,
    user: userReducer // Include the userReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
