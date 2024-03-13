import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import toast from 'react-hot-toast'

// this hook (useAutoNotification) is using inside the NotificationDropdown.js
const useAutoNotification = () => {
  const [stopFetchingFlag, setStopFetchingFlag] = useState(false)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const storedToken = localStorage.getItem('accessToken')
  const url = `${BASE_URL}/downloadStatusPopNotification`

  const fetchAutoNotificationStatus = async () => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        params: {
          clientId: clientId
        }
      })

      const jobData = res.data.job
      const completeJobs = jobData.filter(item => item.jobStatus === 'Completed')
      const keepFetching = jobData.length && jobData.map(item => item.jobStatus).includes('Processing')

      if (completeJobs.length) {
        completeJobs.map(item => toast.success(`Job: ${item.jobName}. Status: ${item.jobStatus}`, { duration: 6000 }))

        // Check if all jobs have a status of 'Completed'
        if (!completeJobs.length) {
          setStopFetchingFlag(true)
        } else if (jobData.length) {
          if (!keepFetching) return setStopFetchingFlag(true)
        } else {
          setStopFetchingFlag(true)
        }
      }
    } catch (error) {
      console.error('Error fetching auto notification status:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (storedToken && clientId && !stopFetchingFlag) {
        await fetchAutoNotificationStatus()
      }
    }

    fetchData()

    const intervalId = setInterval(() => {
      fetchData()
    }, 25000)

    return () => {
      clearInterval(intervalId)
    }
  }, [clientId, storedToken, stopFetchingFlag])
}

export default useAutoNotification
