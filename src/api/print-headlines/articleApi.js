import axios from 'axios'
import { ELASTIC_SERVER } from '../base'

const base_url = process.env.NEXT_PUBLIC_BASE_URL

const removeSpacesFromCommaSeparatedString = str => {
  return str
    ? str
        .split(',')
        .map(item => item.trim())
        .join(',')
    : null
}

export const fetchArticles = async ({
  clientIds,
  companyIds,
  dateType,
  fromDate,
  toDate,
  page,
  recordsPerPage,
  tags,
  media,
  geography,
  headline,
  body,
  journalist,
  wordCombo,
  anyWord,
  ignoreWords,
  phrase,
  editionType,
  publicationCategory,
  sortby,
  language
}) => {
  const source = axios.CancelToken.source()

  try {
    const storedToken = localStorage.getItem('accessToken')

    const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : null
    const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : null

    const formattedMedia = removeSpacesFromCommaSeparatedString(media)
    const formattedTags = removeSpacesFromCommaSeparatedString(tags)
    const formattedGeography = removeSpacesFromCommaSeparatedString(geography)
    const formattedLanguage = removeSpacesFromCommaSeparatedString(language)

    const request_params = {
      clientIds,
      companyIds,
      dateType: 'CREATED_DATE',
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      page,
      recordsPerPage,
      media: formattedMedia,
      tags: formattedTags,
      geography: formattedGeography,
      headline,
      body,
      journalist,
      wordCombo,
      anyWord,
      ignoreWords,
      phrase,
      editionType,
      publicationCategory,
      sortby: sortby || 'LATEST',
      language: formattedLanguage
    }

    const response = await axios.get(`${ELASTIC_SERVER}/api/v1/client/getPrintArticle`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      },
      params: request_params,
      paramsSerializer: params => {
        const str = []
        for (const key in params) {
          if (Array.isArray(params[key])) {
            params[key].forEach(val => {
              str.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
            })
          } else if (params[key] !== null && params[key] !== undefined) {
            str.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
          }
        }

        return str.join('&')
      },
      cancelToken: source.token
    })

    return response.data.data.doc
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
    } else if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      window.location.href = '/login'
    } else {
      throw error
    }
  } finally {
    // No need for cancel here as we are using the source
  }
}

// Function to cancel the fetch
export const cancelFetchArticles = () => {
  if (source) {
    source.cancel('Request canceled by user')
  }
}
