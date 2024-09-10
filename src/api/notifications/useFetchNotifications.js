import { useState, useEffect } from 'react'
import axios from 'axios'
import { JOB_SERVER } from '../base'

// ** Redux
import { useSelector } from 'react-redux'
import { selectSelectedClient, selectNotificationFlag } from 'src/store/apps/user/userSlice'

const useFetchNotifications = () => {
  const [notificationList, setNotificationList] = useState([])
  const [loading, setLoading] = useState(true)
  const selectedClient = useSelector(selectSelectedClient)
  const notificationFlag = useSelector(selectNotificationFlag)
  const clientId = selectedClient ? selectedClient.clientId : null

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        // Check if notificationFlag is true before making the API request
        if (notificationFlag || clientId) {
          setLoading(true)

          const getUserName = JSON.parse(localStorage.getItem('userData'))?.email

          const response = await axios.get(`${JOB_SERVER}/clientArchiveNotificationList`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: {
              clientId: clientId,
              userId: getUserName,
              days: 10
            }
          })

          setNotificationList(response.data.jobList)
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    fetchData()
  }, [clientId, notificationFlag])

  return { notificationList, loading }
}

export default useFetchNotifications
