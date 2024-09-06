import { useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { selectFetchAutoStatusFlag, selectSelectedClient, setFetchAutoStatusFlag } from 'src/store/apps/user/userSlice'
import toast from 'react-hot-toast'
import { JOB_SERVER } from '../base'

const useAutoNotification = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const fetchAutoStatusFlag = useSelector(selectFetchAutoStatusFlag)
  const getUserName = JSON.parse(localStorage.getItem('userData'))?.email

  const clientId = selectedClient ? selectedClient.clientId : null
  const dispatch = useDispatch()
  const storedToken = localStorage.getItem('accessToken')
  const url = `${JOB_SERVER}/downloadStatusPopNotification`

  const fetchAutoNotificationStatus = async () => {
    dispatch(setFetchAutoStatusFlag(true))

    try {
      const res = await axios.get(url, {
        params: {
          clientId: clientId,
          userId: getUserName
        }
      })

      const jobData = res.data.job

      const completeJobs = jobData.length && jobData.filter(item => item.jobStatus === 'Completed')
      const keepFetching = jobData.length && jobData.map(item => item.jobStatus).includes('Processing')
      if (completeJobs.length) {
        completeJobs.forEach(item => {
          toast.success(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span>Job: {item.jobName}</span>
              <span>Status: {item.jobStatus}</span>
              <a className='' key={item.jobId} href={`example/link/${item.jobId}`} target='_blank' rel='noopener'>
                {` DownloadLink`}
              </a>
            </div>,

            { duration: 10000 }
          )
        })

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
