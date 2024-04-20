import { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'
import { useSelector, useDispatch } from 'react-redux'
import { selectFetchAutoStatusFlag, selectSelectedClient, setFetchAutoStatusFlag } from 'src/store/apps/user/userSlice'
import toast from 'react-hot-toast'

// this hook (useAutoNotification) is using inside the NotificationDropdown.js
const useAutoNotification = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const fetchAutoStatusFlag = useSelector(selectFetchAutoStatusFlag)

  const clientId = selectedClient ? selectedClient.clientId : null
  const dispatch = useDispatch()
  const storedToken = localStorage.getItem('accessToken')
  const url = `${BASE_URL}/downloadStatusPopNotification`

  const fetchAutoNotificationStatus = async () => {
    dispatch(setFetchAutoStatusFlag(true))

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

      const completeJobs = jobData.length && jobData.filter(item => item.jobStatus === 'Completed')
      const keepFetching = jobData.length && jobData.map(item => item.jobStatus).includes('Processing')
      console.log('testcode==>', completeJobs)
      if (completeJobs.length) {
        completeJobs.map(item => toast.success(`Job: ${item.jobName}. Status: ${item.jobStatus}`, { duration: 10000 }))

        // Check if all jobs have a status of 'Completed'
        if (jobData.length && keepFetching) {
          dispatch(setFetchAutoStatusFlag(true))
        } else {
          dispatch(setFetchAutoStatusFlag(false))
        }
      }
    } catch (error) {
      console.error('Error fetching auto notification status:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (storedToken && clientId) {
        await fetchAutoNotificationStatus()
      }
    }

    fetchData()

    const intervalId = setInterval(() => {
      fetchData()
    }, 40000)

    return () => {
      clearInterval(intervalId)
    }
  }, [clientId, storedToken])
}

export default useAutoNotification
