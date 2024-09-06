import axios from 'axios'
import { BASE_URL } from '../base'
import { useState } from 'react'

const useExcelDump = screenType => {
  const [responseData, setResponseData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const postData = async ({ clientId, articleIdsWithType, selectedFields, searchCriteria }) => {
    setLoading(true)
    try {
      const storedToken = localStorage.getItem('accessToken')

      const requestData = {
        requestEntity: screenType,
        clientId,
        selectedFields,
        searchCriteria
      }

      if (Array.isArray(articleIdsWithType) && articleIdsWithType.length > 0 && articleIdsWithType !== undefined) {
        requestData.articleIds = articleIdsWithType
      }

      const response = await axios.post(`${BASE_URL}/excelDumpRequest`, requestData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      setError(null)
      setResponseData(response.data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { responseData, loading, error, postData }
}

export default useExcelDump
