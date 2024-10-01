// useUpdateClientTagsToCompanyForArticles.js
import axios from 'axios'
import { useState } from 'react'

import { BASE_URL } from 'src/api/base'

const useUpdateClientTagsToCompanyForArticles = () => {
  const [errorMessage, setErrorMessage] = useState('')

  const postData = async ({ clientId, companyIdsAndTags, articleId }) => {
    const storedToken = localStorage.getItem('accessToken')

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`
      }

      const requestData = {
        clientId,
        companyIdsAndTags,
        articleId
      }

      await axios.post(`${BASE_URL}/updateTagsForPrintArticle`, requestData, { headers })
    } catch (error) {
      setErrorMessage(error.message || error.response?.data || error)
    }
  }

  return { postData, errorMessage }
}

export default useUpdateClientTagsToCompanyForArticles
