import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { selectFetchAutoStatusFlag, selectSelectedClient, setFetchAutoStatusFlag } from 'src/store/apps/user/userSlice'
import toast from 'react-hot-toast'
import { JOB_SERVER } from '../base'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const useAutoNotification = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const fetchAutoStatusFlag = useSelector(selectFetchAutoStatusFlag)
  const getUserName = JSON.parse(localStorage.getItem('userData'))?.email

  const clientId = selectedClient ? selectedClient.clientId : null
  const dispatch = useDispatch()
  const storedToken = localStorage.getItem('accessToken')
  const url = `${JOB_SERVER}/downloadStatusPopNotification`

  const [nullJobDataCount, setNullJobDataCount] = useState(0)
  const [emptyJobProgressCount, setEmptyJobProgressCount] = useState(0)

  const fetchAutoNotificationStatus = async () => {
    if (!fetchAutoStatusFlag) {
      return
    }

    try {
      const res = await axios.get(url, {
        params: {
          clientId: clientId,
          userId: getUserName
        }
      })

      const jobData = res.data.jobs || []

      if (jobData.length > 0) {
        setNullJobDataCount(0)
        setEmptyJobProgressCount(0)

        const completeJobs = jobData.filter(item => item.jobStatus === 'Completed')
        const inProgressJobs = jobData.some(item => item.jobStatus === 'Processing' || item.jobStatus === 'In Progress')

        if (completeJobs.length) {
          completeJobs.forEach(item => {
            toast.success(
              t => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    maxWidth: '300px',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                    <IconButton size='small' onClick={() => toast.dismiss(t.id)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <div style={{ marginRight: '2rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Job:</span>{' '}
                    {!!item?.downloadLink ? item.jobName.substring(0, 20) + '...' : 'Mail sent!'}
                  </div>
                  <div style={{ marginRight: '2rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Status:</span> {item.jobStatus}
                  </div>
                  {!!item?.downloadLink && (
                    <div>
                      <span style={{ fontWeight: 'bold' }}>Link:</span>{' '}
                      <a
                        href={`${process.env.NEXT_PUBLIC_JOB_SERVER}/downloadFile/${item?.downloadLink}`}
                        target='_blank'
                        rel='noopener'
                        style={{ textDecoration: 'none', color: '#1E88E5' }}
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              ),
              { duration: 10000, closeButton: true }
            )
          })
        }

        if (inProgressJobs) {
          dispatch(setFetchAutoStatusFlag(true))
        } else {
          setEmptyJobProgressCount(prevCount => prevCount + 1)

          if (emptyJobProgressCount >= 2) {
            dispatch(setFetchAutoStatusFlag(false))
            setEmptyJobProgressCount(0)
          }
        }
      } else {
        setNullJobDataCount(prevCount => prevCount + 1)

        if (nullJobDataCount >= 2) {
          dispatch(setFetchAutoStatusFlag(false))
          setNullJobDataCount(0)
        }
      }
    } catch (error) {
      console.error('Error fetching auto notification status:', error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (storedToken && clientId && fetchAutoStatusFlag) {
        await fetchAutoNotificationStatus()
      }
    }

    fetchData()

    const intervalId = setInterval(() => {
      if (fetchAutoStatusFlag) {
        fetchData()
      }
    }, 10000)

    return () => {
      clearInterval(intervalId)
    }
  }, [clientId, storedToken, fetchAutoStatusFlag, nullJobDataCount, emptyJobProgressCount])

  return null
}

export default useAutoNotification
