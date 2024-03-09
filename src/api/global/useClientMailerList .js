import { useState, useEffect } from 'react'
import axios from 'axios'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from '../base'

const useClientMailerList = ({ fetchEmailFlag }) => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [mailList, setMailList] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const getClientMailerList = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        const url = `${BASE_URL}/clientMailerList/`

        const headers = {
          Authorization: `Bearer ${storedToken}`
        }

        const requestData = {
          clientId
        }

        const axiosConfig = {
          headers,
          params: requestData
        }

        const axiosResponse = await axios.get(url, axiosConfig)
        setMailList(axiosResponse.data.emails)
      } catch (axiosError) {
        setError(axiosError)
      }
    }

    getClientMailerList()
  }, [clientId, fetchEmailFlag])

  return { mailList, error }
}

export default useClientMailerList
