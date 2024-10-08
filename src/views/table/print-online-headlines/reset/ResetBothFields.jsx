import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'

import {
  clearDateFilter,
  selectSelectedClient,
  setClearDateFilter,
  setSelectedCompetitions
} from 'src/store/apps/user/userSlice'

function ResetBothFields(props) {
  const {
    setSelectedGeography,
    setSelectedLanguage,
    setSelectedMedia,
    setSelectedTags,
    setSelectedArticles,
    setArticles
  } = props
  const dispatch = useDispatch()
  const selectedClient = useSelector(selectSelectedClient)
  const clearDateFlag = useSelector(clearDateFilter)
  const priorityCompanyId = selectedClient?.priorityCompanyId

  const handleClear = () => {
    dispatch(setSelectedCompetitions([priorityCompanyId]))
    dispatch(setClearDateFilter(!clearDateFlag))
    setSelectedGeography([])
    setSelectedLanguage([])
    setSelectedMedia([])
    setSelectedTags([])
    setSelectedArticles([])
    setArticles([])
  }

  return <Button onClick={handleClear}>CLEAR</Button>
}

export default ResetBothFields
