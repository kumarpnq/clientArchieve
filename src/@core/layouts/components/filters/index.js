import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  ListItemButton,
  MenuItem,
  OutlinedInput,
  Slide,
  Stack,
  Typography
} from '@mui/material'
import React, { Fragment, useCallback, useEffect, useReducer, useState } from 'react'

// * Mui Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

// * Static Values
import { articleSize, prominence, tonality } from 'src/data/filter'

// * Components
import Menu from 'src/@core/components/filter-menu'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

function filterReducer(prevState, action) {
  switch (action.type) {
    case 'company':
      return { ...prevState, company: { ...prevState.company, ...action.payload } }

    case 'editionType':
      return { ...prevState, editionType: { ...prevState.editionType, ...action.payload } }

    case 'media':
      return { ...prevState, media: { ...prevState.media, ...action.payload } }

    case 'publication':
      return { ...prevState, publication: { ...prevState.publication, ...action.payload } }

    case 'geography':
      return { ...prevState, geography: { ...prevState.geography, ...action.payload } }

    case 'language':
      return { ...prevState, language: { ...prevState.language, ...action.payload } }

    case 'prominence':
      return { ...prevState, prominence: { ...prevState.prominence, ...action.payload } }

    case 'tonality':
      return { ...prevState, tonality: { ...prevState.tonality, ...action.payload } }

    case 'theme':
      return { ...prevState, theme: { ...prevState.theme, ...action.payload } }

    case 'articleSize':
      return { ...prevState, articleSize: { ...prevState.articleSize, ...action.payload } }

    case 'tags':
      return { ...prevState, tags: { ...prevState.tags, ...action.payload } }

    default:
      return prevState
  }
}

const defaultFilter = {
  company: {
    title: 'Company/Topic name',
    search: '',
    values: [],
    name: 'companyName',
    value: 'companyId'
  },
  editionType: {
    title: 'Edition Type',
    values: [],
    name: 'editionTypeName',
    value: 'editionTypeId'
  },
  media: {
    title: 'Media',
    values: [],
    name: 'publicationName',
    value: 'publicationId'
  },
  publication: {
    title: 'Publication',
    values: [],
    name: 'publicationTypeName',
    value: 'publicationTypeId'
  },

  geography: {
    title: 'Geography',
    search: '',
    values: [],
    name: 'cityName',
    value: 'cityId'
  },
  language: {
    title: 'Language',
    search: '',
    values: [],
    name: 'name',
    value: 'id'
  },
  prominence: {
    title: 'Prominence',
    values: prominence,
    name: 'prominenceName',
    value: 'prominenceId'
  },
  tonality: {
    title: 'Tonality',
    values: tonality,
    name: 'tonalityName',
    value: 'tonalityId'
  },
  theme: {
    title: 'Theme',
    search: '',
    values: [],
    name: 'themeName',
    value: 'themeId'
  },
  articleSize: {
    title: 'Article Size',
    values: articleSize,
    name: 'articleSizeName',
    value: 'articleSizeId'
  },
  tags: {
    title: 'Tags',
    search: '',
    values: [],
    name: 'tagsName',
    value: 'tagsId'
  }
}

const filterNames = Object.keys(defaultFilter)

function createMenuState() {
  const menuItems = {}
  filterNames.forEach(key => {
    menuItems[key] = { anchorEl: null, selected: [] }
  })

  return menuItems
}

function Filter() {
  const [filterState, filterDispatch] = useReducer(filterReducer, defaultFilter)
  const [menuState, setMenuState] = useState(() => createMenuState())
  const [mapData, setMapData] = useState(new Map())
  const [collapse, setCollapse] = useState(false)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  function openMenu(e, menuName) {
    setMenuState(prev => ({ ...prev, [menuName]: { ...prev[menuName], anchorEl: e.currentTarget } }))
  }

  function closeMenu(menuName) {
    setMenuState(prev => ({ ...prev, [menuName]: { ...prev[menuName], anchorEl: null } }))
  }

  const toggleCollapse = () => setCollapse(!collapse)

  const handleSelection = (key, value) => {
    if (mapData.has(key)) {
      mapData.delete(key)
      setMapData(new Map(mapData))
    } else {
      setMapData(new Map(mapData.set(key, value)))
    }
  }

  const deleteSelectedFilter = (category, i) => {
    const selected = [...menuState[category].selected]
    const key = selected.splice(i, 1)[0]
    mapData.delete(key)
    setMapData(new Map(mapData))
    setMenuState(prev => ({ ...prev, [category]: { ...prev[category], selected } }))
  }

  const handleSelectedFilter = (category, key) => {
    const selected = [...menuState[category].selected]
    if (selected.includes(key)) {
      selected.splice(selected.indexOf(key), 1)
    } else {
      selected.push(key)
    }
    setMenuState(prev => ({ ...prev, [category]: { ...prev[category], selected } }))
  }

  // * Data fetching functions
  const fetchCompany = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      // Fetch companies
      const responseCompanies = await axios.get(`${BASE_URL}/companyListByClient/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        params: {
          clientId: clientId
        }
      })

      filterDispatch({ type: 'company', payload: { values: responseCompanies.data.companies } })
    } catch (error) {
      console.error('Error in fetchCompany :', error)
    }
  }, [clientId])

  const fetchEditionType = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      // Fetch edition types
      const editionTypeResponse = await axios.get(`${BASE_URL}/editionTypesList/`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      filterDispatch({ type: 'editionType', payload: { values: editionTypeResponse.data.editionTypesList } })
    } catch (error) {
      console.error('Error in fetchEditionType :', error)
    }
  }, [])

  const fetchPublication = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      // Fetch publication
      const publicationResponse = await axios.get(`${BASE_URL}/printMediaList`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params: { clientId }
      })
      filterDispatch({ type: 'media', payload: { values: publicationResponse.data.mediaList } })
    } catch (error) {
      console.error('Error in fetchPublication :', error)
    }
  }, [clientId])

  const fetchPublicationTypes = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const response = await axios.get(`${BASE_URL}/publicationCategoryList/`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      filterDispatch({ type: 'publication', payload: { values: response.data.publicationsTypeList } })
    } catch (error) {
      console.error('Error in fetchPublicationType :', error)
    }
  }, [])

  const fetchCities = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      // Fetch cities
      const citiesResponse = await axios.get(`${BASE_URL}/citieslist/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      filterDispatch({ type: 'geography', payload: { values: citiesResponse.data.cities } })
    } catch (error) {
      console.error('Error in fetchCities :', error)
    }
  }, [])

  const fetchLanguage = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      // Fetch languages
      const languageResponse = await axios.get(`${BASE_URL}/languagelist/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      filterDispatch({ type: 'language', payload: { values: languageResponse.data.languages } })
    } catch (error) {
      console.error('Error in fetchLanguage :', error)
    }
  }, [])

  const fetchTags = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const tagsResponse = await axios.get(`${BASE_URL}/getTagListForClient`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params: { clientId }
      })

      filterDispatch({ type: 'tags', payload: { values: tagsResponse.data.clientTags } })
    } catch (error) {
      console.error('Error in fetchTags :', error)
    }
  }, [clientId])

  // * useEffect hooks
  useEffect(() => {
    fetchCompany()
  }, [fetchCompany])

  useEffect(() => {
    fetchEditionType()
  }, [fetchEditionType])

  useEffect(() => {
    fetchPublication()
  }, [fetchPublication])

  useEffect(() => {
    fetchPublicationTypes()
  }, [fetchPublicationTypes])

  useEffect(() => {
    fetchCities()
  }, [fetchCities])

  useEffect(() => {
    fetchLanguage()
  }, [fetchLanguage])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return (
    <Box py={2} px={3}>
      <Stack direction='row' gap={2} flexWrap='wrap'>
        {filterNames.map(filterKey => (
          <Fragment key={filterKey}>
            <Button
              variant='text'
              sx={{ py: 0.5, px: 1, borderRadius: 2, color: 'text.secondary' }}
              endIcon={<KeyboardArrowDownIcon fontSize='small' />}
              onClick={e => {
                openMenu(e, filterKey)
              }}
            >
              {defaultFilter[filterKey].title}
            </Button>

            <Menu
              search={'search' in filterState[filterKey]}
              anchorEl={menuState[filterKey].anchorEl}
              open={Boolean(menuState[filterKey].anchorEl)}
              onClose={() => closeMenu(filterKey)}
              disableScrollLock
            >
              {filterState[filterKey].values.map(val => {
                const name = val[filterState[filterKey].name]
                const value = val[filterState[filterKey].value]

                return (
                  <MenuItem
                    key={value}
                    onClick={() => {
                      // handleSelection(item, item)
                      // handleSelectedFilter(filterKey, item)
                    }}

                    // selected={mapData?.has(item)}
                  >
                    {name}
                  </MenuItem>
                )
              })}
            </Menu>
          </Fragment>
        ))}
      </Stack>

      <Slide direction='up' in={mapData.size > 0} mountOnEnter unmountOnExit>
        <Box
          position='fixed'
          top={180}
          display='flex'
          justifyContent='center'
          alignItems='center'
          right={30}
          zIndex={1400}
        >
          <Card
            sx={{
              width: 'min(376px, 95%)',
              borderRadius: 2,
              boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemButton onClick={toggleCollapse}>
              <Stack direction='row' justifyContent='space-between' alignItems='center' width={'100%'}>
                <Typography variant='subtitle1' color='primary.main'>
                  {mapData.size} Filter applied
                </Typography>

                {collapse ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowUpIcon size='small' />}
              </Stack>
            </ListItemButton>
            <Collapse direction='up' in={collapse}>
              <Box px={2} py={1} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {Object.keys(menuState).map(menu => {
                  if (menuState[menu].selected.length === 0) return null

                  return (
                    <Fragment key={menu}>
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle1' fontWeight={500} gutterBottom>
                          {menu}
                        </Typography>
                        <Button variant='outlined' color='primary' sx={{ py: 0.1 }}>
                          Clear all
                        </Button>
                      </Stack>
                      <Stack direction='row' spacing={1} mb={2}>
                        {menuState[menu].selected.map((item, i) => (
                          <Chip
                            label={mapData.get(item)}
                            key={item}
                            size='small'
                            variant='outlined'
                            sx={{
                              backgroundColor: 'background.default',
                              borderRadius: '6px',
                              px: 0.2,
                              borderColor: 'divider',
                              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;'
                            }}
                            onDelete={() => deleteSelectedFilter(menu, i)}
                            deleteIcon={<CloseIcon sx={{ cursor: 'pointer' }} />}
                          />
                        ))}
                      </Stack>
                    </Fragment>
                  )
                })}
              </Box>
            </Collapse>
          </Card>
        </Box>
      </Slide>
    </Box>
  )
}

export default Filter
