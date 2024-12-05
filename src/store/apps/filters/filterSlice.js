import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  company: [],
  editionType: [],
  media: [],
  publication: [],
  geography: [],
  language: [],
  prominence: [],
  tonality: [],
  theme: [],
  articleSize: [],
  tags: []
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload
    },
    setEditionType: (state, action) => {
      state.editionType = action.payload
    },
    setMedia: (state, action) => {
      state.media = action.payload
    },
    setPublication: (state, action) => {
      state.publication = action.payload
    },
    setGeography: (state, action) => {
      state.geography = action.payload
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    setProminence: (state, action) => {
      state.prominence = action.payload
    },
    setTonality: (state, action) => {
      state.tonality = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setArticleSize: (state, action) => {
      state.articleSize = action.payload
    },
    setTags: (state, action) => {
      state.tags = action.payload
    }
  }
})

export const {
  setCompany,
  setEditionType,
  setMedia,
  setPublication,
  setGeography,
  setLanguage,
  setProminence,
  setTonality,
  setTheme,
  setArticleSize,
  setTags
} = filterSlice.actions

export default filterSlice.reducer
