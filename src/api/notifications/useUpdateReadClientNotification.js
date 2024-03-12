// useUpdateClientNotification.js
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'

// ** Redux
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const useUpdateClientNotification = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const selectedClient = useSelector(selectSelectedClient)

  const clientId = selectedClient ? selectedClient.clientId : null

  const updateReadClientNotification = async jobId => {
    const storedToken = localStorage.getItem('accessToken')
    const url = `${BASE_URL}/updateReadClientNotification/`

    const headers = {
      Authorization: `Bearer ${storedToken}`,
      'Content-Type': 'application/json'
    }

    const params = {
      clientId: clientId,
      jobId: jobId
    }

    setLoading(true)

    try {
      const response = await axios.put(url, params, { headers })
      setData(response.data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, updateReadClientNotification }
}

export default useUpdateClientNotification
