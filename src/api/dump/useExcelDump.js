import axios from 'axios'
import { BASE_URL } from '../base'
import { useState } from 'react'

const useExcelDump = () => {
  const [responseData, setResponseData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const postData = async ({ clientId, articleIds, selectedFields, searchCriteria }) => {
    setLoading(true)
    try {
      const storedToken = localStorage.getItem('accessToken')

      const response = await axios.post(
        `${BASE_URL}/excelDumpRequest`,
        {
          clientId,
          articleIds: articleIds.length > 0 ? articleIds : [],
          selectedFields,
          searchCriteria
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      )
      setResponseData(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError(error.message || error)
      setLoading(false)
    }
  }

  return { responseData, loading, error, postData }
}

export default useExcelDump
