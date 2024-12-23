// ** Toolkit imports
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// ** Redux-persist
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// ** Reducers
import chat from 'src/store/apps/chat'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import userReducer from 'src/store/apps/user/userSlice' // Update this import
import filter from 'src/store/apps/filters/filterSlice'
import preferenceReducer from 'src/store/apps/preference/preferenceSlice'

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, preferenceReducer)

const rootReducer = combineReducers({
  chat,
  email,
  invoice,
  calendar,
  permissions,
  user: userReducer, // Include the userReducer
  filter,
  preference: persistedReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
