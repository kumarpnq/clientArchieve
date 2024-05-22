import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectUserData } from 'src/store/apps/user/userSlice'

const useChartPermission = chartName => {
  const userDetails = useSelector(selectUserData)

  const permission = useMemo(() => {
    return userDetails?.clientArchiveRoles?.find(role => role.name === chartName)?.permission || false
  }, [chartName, userDetails])

  return permission
}

export default useChartPermission
