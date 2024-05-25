import { useState } from 'react'
import axios from 'axios'

// ** redux
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedClient, setFetchAfterReportsChange } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

const useRemove = () => {
  const [reportActionLoading, setReportActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const dispatch = useDispatch()

  const deleteJournalistReport = async (selectedDashboard, reportId) => {
    setReportActionLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        Authorization: `Bearer ${storedToken}`
      }

      const requestData = {
        clientId,
        dashboardId: selectedDashboard,

        reportId,
        action: 'delete'
      }

      const response = await axios.post(`${BASE_URL}/updateUserDashboards`, requestData, { headers })
      setSuccess(true)
      if (response.status === 200) {
        dispatch(setFetchAfterReportsChange(true))
      }
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setReportActionLoading(false)
    }
  }

  return { deleteJournalistReport, reportActionLoading }
}

export default useRemove
