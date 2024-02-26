import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'

const useUserDataAndCompanies = clientId => {
  const [competitors, setCompetitors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/companyListByClient/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: {
              clientId: clientId
            }
          })
          setCompetitors(response.data.companies)
        }
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDataAndCompanies()
  }, [clientId])

  return { competitors, loading }
}

export default useUserDataAndCompanies
