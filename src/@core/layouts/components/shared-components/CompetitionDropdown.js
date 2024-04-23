import { useState, Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BusinessIcon from '@mui/icons-material/Business'
import { IconButton, Menu, ListItem, MenuItem, Button } from '@mui/material'
import useFetchCompetition from 'src/api/global/useFetchCompetitions'

// ** redux import
import {
  setSelectedCompetitions,
  selectSelectedCompetitions,
  selectUserData,
  selectSelectedClient,
  selectShortCut
} from 'src/store/apps/user/userSlice'

const Competition = props => {
  const { settings } = props

  // ** Vars
  const { direction } = settings
  const dispatch = useDispatch()
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedClient = useSelector(selectSelectedClient)
  const priorityCompanyId = selectedClient?.priorityCompanyId
  const userData = useSelector(selectUserData)
  const shortCutData = useSelector(selectShortCut)

  console.log('shortcutdata==>', selectedClient)

  const competitionSelection = userData.clientArchiveRoles
    .filter(i => i.name === 'competition')
    .map(i => i.option)
    .join()

  const [anchorEl, setAnchorEl] = useState(null)
  const { competitions } = useFetchCompetition()

  const [localeComps, setLocaleComps] = useState([])
  console.log("locaplcomps==>", localeComps)
  const handleClientClick = selectedComp => {
    setLocaleComps(prevSelected => {
      const isAlreadySelected = prevSelected.includes(selectedComp)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== selectedComp)
      } else {
        // If not selected, add to the list
        return [...prevSelected, selectedComp]
      }
    })
  }
  useEffect(() => {
    const allCompanyIds = competitions.map(company => company.companyId)
    const defaultSelection = competitionSelection === 'All' ? allCompanyIds : [priorityCompanyId]

    // Check if the company ID is present in the search criteria
    const companyIdsInSearchCriteria = shortCutData?.searchCriteria?.companyIds?.split(',').map(id => id.trim())

    // If the company ID is present in the search criteria, prefill it
    if (companyIdsInSearchCriteria && companyIdsInSearchCriteria.includes(priorityCompanyId)) {
      setLocaleComps([priorityCompanyId])
    } else {
      setLocaleComps(defaultSelection)
    }
  }, [competitionSelection, competitions, dispatch, priorityCompanyId, shortCutData])

  useEffect(() => {
    dispatch(setSelectedCompetitions(localeComps))
  }, [localeComps, dispatch])

  const handleSelectAllCompetitions = () => {
    const allCompanyIds = competitions.map(company => company.companyId)
    setLocaleComps([...allCompanyIds])
  }

  const handleDeselectAllCompetitions = () => {
    setLocaleComps([])
  }

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton onClick={handleIconClick} color='primary' aria-haspopup='true'>
        <BusinessIcon fontSize='1.625rem' />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ mt: 4.25, minWidth: 200 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        {competitions.length > 0 && (
          <ListItem sx={{ justifyContent: 'space-between' }}>
            <Button onClick={handleSelectAllCompetitions}>Select All</Button>
            <Button onClick={handleDeselectAllCompetitions}>Deselect All</Button>
          </ListItem>
        )}

        {competitions.map(company => (
          <MenuItem
            key={company.companyId}
            onClick={() => handleClientClick(company.companyId)}
            selected={selectedCompetitions.includes(company.companyId) || shortCutData?.searchCriteria?.companyIds}
          >
            {company.companyName}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}

export default Competition
