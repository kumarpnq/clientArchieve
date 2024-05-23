import { useState } from 'react'
import axios from 'axios'

// ** redux
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const useRemove = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const deleteJournalistReport = async (selectedDashboard, reportId) => {
    setLoading(true)
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
      console.log(response)
      setSuccess(true)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { deleteJournalistReport }
}

export default useRemove
