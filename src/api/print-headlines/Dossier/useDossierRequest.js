import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useDossierRequest = () => {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const sendDossierRequest = async ({
    clientId,
    articleIds,
    subject,
    recipients,
    searchCriteria,
    clientName,
    dossierType,
    requestEntity
  }) => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const url = `${BASE_URL}/dossierRequest/`

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const requestData = {
        clientId,
        articleIds,
        subject,
        recipients,
        searchCriteria,
        clientName,
        dossierType,
        requestEntity
      }

      const axiosConfig = {
        headers
      }

      const axiosResponse = await axios.post(url, requestData, axiosConfig)
      setResponse(axiosResponse.data)
    } catch (axiosError) {
      setError(axiosError)
    }
  }

  return { response, error, sendDossierRequest }
}

export default useDossierRequest
