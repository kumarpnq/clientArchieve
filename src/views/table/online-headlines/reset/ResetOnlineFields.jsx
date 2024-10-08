import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'

import {
  clearDateFilter,
  selectSelectedClient,
  setClearDateFilter,
  setSelectedCompetitions
} from 'src/store/apps/user/userSlice'

function ResetOnlineFields(props) {
  const {
    setSelectedGeography,
    setSelectedLanguage,
    setSelectedMedia,
    setSelectedTags,
    setSelectedArticles,
    setSocialFeeds
  } = props
  const dispatch = useDispatch()
  const selectedClient = useSelector(selectSelectedClient)
  const clearDateFlag = useSelector(clearDateFilter)
  const priorityCompanyId = selectedClient?.priorityCompanyId

  const handleClear = () => {
    dispatch(setClearDateFilter(!clearDateFlag))
    dispatch(setSelectedCompetitions([priorityCompanyId]))
    setSelectedGeography([])
    setSelectedLanguage([])
    setSelectedMedia([])
    setSelectedTags([])
    setSelectedArticles([])
    setSocialFeeds([])
  }

  return <Button onClick={handleClear}>CLEAR</Button>
}

export default ResetOnlineFields
