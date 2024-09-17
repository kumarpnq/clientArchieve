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

  const fetchAutoNotificationStatus = async () => {
    dispatch(setFetchAutoStatusFlag(true))

    try {
      // const storedToken = localStorage.getItem('accessToken')

      const res = await axios.get(url, {
        // headers: {
        //   Authorization: `Bearer ${storedToken}`
        // },
        params: {
          clientId: clientId,
          userId: getUserName
        }
      })

      const jobData = res.data.jobs

      const completeJobs = jobData.length && jobData.filter(item => item.jobStatus === 'Completed')
      const keepFetching = jobData.length && jobData.map(item => item.jobStatus).includes('Processing')

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

        if (jobData.length && keepFetching) {
          dispatch(setFetchAutoStatusFlag(true))
        } else {
          dispatch(setFetchAutoStatusFlag(false))
        }
      }
    } catch (error) {
      console.error('Error fetching auto notification status:', error.message)

      dispatch(setFetchAutoStatusFlag(false))
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
    }, 10000)

    return () => {
      clearInterval(intervalId)
    }
  }, [clientId, storedToken])
}

export default useAutoNotification
