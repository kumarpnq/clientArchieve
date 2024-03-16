import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const useFetchCompetition = () => {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  useEffect(() => {
    const fetchCompetitions = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        setLoading(true)

        const response = await axios.get(`${BASE_URL}/companyListByClient/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setCompetitions(response.data.companies)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setCompetitions([])
        setError(error)
        setLoading(false)
      }
    }
    fetchCompetitions()
  }, [clientId])

  return { competitions, loading, error }
}

export default useFetchCompetition
