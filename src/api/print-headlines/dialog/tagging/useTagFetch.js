import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useFetchTags = clientId => {
  const [tags, setTags] = useState([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        const requestParams = {
          clientId: clientId
        }

        const response = await axios.get(`${BASE_URL}/printClientCompanyTags`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: requestParams
        })
        setTags(response.data.clientTags || [])
      } catch (error) {
        console.error('Tags error', error)
      }
    }

    fetchTags()
  }, [clientId])

  return tags
}

export default useFetchTags
