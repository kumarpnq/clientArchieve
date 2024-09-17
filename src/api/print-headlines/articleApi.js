import axios from 'axios'

const base_url = process.env.NEXT_PUBLIC_BASE_URL

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
  let cancel
  const source = axios.CancelToken.source()

  try {
    const storedToken = localStorage.getItem('accessToken')

    // const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : null
    // const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : null

    const request_params = {
      clientIds: '0',
      dateType: 'articleInfo.articleDate',
      fromDate: '2024-04-01',
      toDate: '2024-09-14',
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

    // const response = await axios.get(`${base_url}/clientWisePrintArticles/`,
    const response = await axios.get(
      `http://51.222.9.159:5000/api/v1/client/getPrintArticle`,

      {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        params: request_params,
        cancelToken: source.token
      }
    )

    console.log('checkingresponsue-==<', response.data.data.doc)
    return response.data.data.doc
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
