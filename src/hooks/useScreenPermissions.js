import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserData } from 'src/store/apps/user/userSlice'

const screens = ['onlineHeadlines', 'printHeadlines', 'bothHeadlines', 'printDashboard', 'onlineDashboard', 'analytics']

const useScreenPermissions = () => {
  const userData = useSelector(selectUserData)
  const data = userData.clientArchiveRoles || []

  const [screenPermissions, setScreenPermissions] = useState(() => {
    const initialPermissions = {}
    screens.forEach(screen => {
      initialPermissions[screen] = false
    })

    return initialPermissions
  })

  useEffect(() => {
    const updateScreenPermissions = () => {
      const newPermissions = {}
      screens.forEach(screen => {
        const tool = data.find(i => i.name === screen && i.type === 'screen')
        newPermissions[screen] = tool ? tool.permission : false
      })
      setScreenPermissions(newPermissions)
    }

    updateScreenPermissions()
  }, [userData, data])

  return screenPermissions
}

export default useScreenPermissions
