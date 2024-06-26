import axios from 'axios'

const base_url = process.env.NEXT_PUBLIC_BASE_URL

export const fetchArticles = async ({
  clientIds,
  companyIds,
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
  let cancel
  const source = axios.CancelToken.source()

  try {
    const storedToken = localStorage.getItem('accessToken')

    const request_params = {
      clientIds,
      companyIds,
      fromDate,
      toDate,
      page,
      recordsPerPage,
      media,
      tags,
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
    }

    const response = await axios.get(`${base_url}/clientWisePrintArticles/`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      },
      params: request_params,
      cancelToken: source.token
    })

    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
    } else if (error.response && error.response.status === 401) {
      // Unauthorized error, navigate to the login page
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      window.location.href = '/login'
    } else {
      throw error
    }
  } finally {
    if (cancel) {
      cancel()
    }
  }
}

export const cancelFetchArticles = () => {
  if (source) {
    source.cancel('Request canceled by user')
  }
}
