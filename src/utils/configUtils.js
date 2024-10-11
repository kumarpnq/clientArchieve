import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const useConfigUtils = () => {
  const storedToken = localStorage.getItem('accessToken')
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const clientName = selectedClient ? selectedClient.email : null

  return { storedToken, clientId, clientName }
}

export default useConfigUtils
