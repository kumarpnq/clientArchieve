import { useState, useEffect } from 'react'
import { BASE_URL } from '../base'
import axios from 'axios'
import dayjs from 'dayjs'

// ** Redux
import { useSelector } from 'react-redux'
import { selectSelectedClient, selectSelectedStartDate, selectSelectedEndDate } from 'src/store/apps/user/userSlice'
import { formatDateTime } from 'src/utils/formatDateTime'

const useFetchSocialMediaData = ({ mediaType, encryptStr, authToken, screen }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectedClient = useSelector(selectSelectedClient)
  const clientIds = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null

  const formatDate = dateTimeString => {
    return dayjs(dateTimeString).format('YYYY-MM-DD')
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = {
          clientIds,
          fromDate: formatDate(formattedStartDate),
          toDate: formatDate(formattedEndDate),
          mediaType
        }

        const response = await axios.get(`${BASE_URL}/socialMediaData`, {
          params,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })

        setData(response.data.socialMediaData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mediaType, encryptStr, formattedStartDate, formattedEndDate, clientIds])

  return { data, loading, error }
}

export default useFetchSocialMediaData
