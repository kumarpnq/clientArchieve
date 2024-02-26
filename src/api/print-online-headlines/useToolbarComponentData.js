import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const useUserDataAndCompanies = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [companies, setCompanies] = useState([])
  const [languages, setLanguages] = useState({})
  const [cities, setCities] = useState([])
  const [media, setMedia] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          // Fetch companies
          const responseCompanies = await axios.get(`${BASE_URL}/companyListByClient/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: {
              clientId: clientId
            }
          })
          setCompanies(responseCompanies.data.companies)
        }

        // Fetch languages
        const responseLanguages = await axios.get(`${BASE_URL}/languagelist/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setLanguages(responseLanguages.data.languages)

        // Fetch cities
        const responseCities = await axios.get(`${BASE_URL}/citieslist/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setCities(responseCities.data.cities)

        // Fetch media
        const responseMedia = await axios.get(`${BASE_URL}/printMediaList`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setMedia(responseMedia.data.mediaList)

        // Fetch tags
        const responseTags = await axios.get(`${BASE_URL}/printClientCompanyTags`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setTags(responseTags.data.clientTags)
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      }
    }

    fetchUserDataAndCompanies()
  }, [clientId])

  return { companies, languages, cities, media, tags }
}

export default useUserDataAndCompanies
