import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserData } from 'src/store/apps/user/userSlice'

export const useToolPermission = () => {
  const userData = useSelector(selectUserData)
  const data = userData.clientArchiveRoles || []

  const [isDossierVisible, setIsDossierVisible] = useState(false)
  const [isMailVisible, setIsMailVisible] = useState(false)
  const [isExcelDumpVisible, setIsExcelDumpVisible] = useState(false)

  useEffect(() => {
    const checkPermission = toolName => {
      const tool = data.find(i => i.name === toolName)

      return tool ? tool.permission : false
    }

    setIsDossierVisible(checkPermission('dossier'))
    setIsMailVisible(checkPermission('mail'))
    setIsExcelDumpVisible(checkPermission('excelDump'))
  }, [userData, data])

  return {
    isDossierVisible,
    isMailVisible,
    isExcelDumpVisible
  }
}
