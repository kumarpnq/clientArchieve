import { Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  clearDateFilter,
  selectSelectedClient,
  setClearDateFilter,
  setSelectedCompetitions
} from 'src/store/apps/user/userSlice'

function ResetPrintFields(props) {
  const { setSelectedGeography, setSelectedLanguage, setSelectedMedia, setSelectedTags, setSelectedArticles } = props
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
  }

  return <Button onClick={handleClear}>CLEAR</Button>
}

export default ResetPrintFields
