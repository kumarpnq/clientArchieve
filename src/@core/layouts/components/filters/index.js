import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  ListItemButton,
  Menu,
  MenuItem,
  Slide,
  Stack,
  Typography
} from '@mui/material'
import React, { Fragment, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

// * Mui Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'

// * Static Values
import { articleSize, prominence, tonality } from 'src/data/filter'

// * Components
import FilterMenu from 'src/@core/components/filter-menu'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import { useDebouncedCallback } from '@mantine/hooks'
import { setInitialState, updateFilters } from 'src/store/apps/filters/filterSlice'
import { useDispatch } from 'react-redux'

function filterReducer(prevState, action) {
  switch (action.type) {
    case 'companyIds':
      return { ...prevState, companyIds: { ...prevState.companyIds, ...action.payload } }

    case 'editionType':
      return { ...prevState, editionType: { ...prevState.editionType, ...action.payload } }

    case 'media':
      return { ...prevState, media: { ...prevState.media, ...action.payload } }

    case 'publicationGroup':
      return { ...prevState, publicationGroup: { ...prevState.publicationGroup, ...action.payload } }

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
  companyIds: {
    title: 'Company/Topic name',
    filter: '',
    values: [],
    backup: [],
    value: 'companyName',
    key: 'companyId'
  },
  media: {
    title: 'Media',
    values: [],
    value: 'publicationTypeName',
    key: 'publicationTypeId'
  },
  editionType: {
    title: 'Edition Type',
    values: [],
    value: 'editionTypeName',
    key: 'editionTypeId'
  },
  publicationGroup: {
    title: 'Publication Group',
    values: [],
    search: '',
    value: 'publicationGroupName',
    key: 'publicationGroupID'
  },
  publication: {
    title: 'Publication',
    values: [],
    search: '',
    value: 'publicationName',
    key: 'publicationId',
    disabled: 'publicationGroup'
  },

  geography: {
    title: 'Geography',
    filter: '',
    backup: [],
    values: [],
    value: 'cityName',
    key: 'cityId'
  },
  language: {
    title: 'Language',
    filter: '',
    backup: [],
    values: [],
    value: 'name',
    key: 'id'
  },
  prominence: {
    title: 'Prominence',
    values: prominence,
    value: 'prominenceName',
    key: 'prominenceId'
  },
  tonality: {
    title: 'Tonality',
    values: tonality,
    value: 'tonalityName',
    key: 'tonalityId'
  },
  theme: {
    title: 'Theme',
    filter: '',
    backup: [],
    values: [],
    value: 'name',
    key: 'name'
  },
  articleSize: {
    title: 'Article Size',
    values: articleSize,
    value: 'articleSizeName',
    key: 'articleSizeId'
  },
  tags: {
    title: 'Tags',
    search: '',
    values: [],
    value: 'tagsName',
    key: 'tagsId'
  }
}

const filterNames = Object.keys(defaultFilter)

function createMenuState() {
  const menuItems = {}
  filterNames.forEach(key => {
    menuItems[key] = { anchorEl: null, selected: new Map() }
  })

  return menuItems
}

function Filter() {
  const [filterState, filterDispatch] = useReducer(filterReducer, defaultFilter)
  const [menuState, setMenuState] = useState(() => createMenuState())
  const [collapse, setCollapse] = useState(false)
  const selectedClient = useSelector(selectSelectedClient)

  const clientId = selectedClient ? selectedClient.clientId : null
  const { editionType, publicationGroup, media } = useSelector(state => state.filter)
  const dispatch = useDispatch()

  function openMenu(e, menuName) {
    setMenuState(prev => ({ ...prev, [menuName]: { ...prev[menuName], anchorEl: e.currentTarget } }))
  }

  function closeMenu(menuName) {
    setMenuState(prev => ({ ...prev, [menuName]: { ...prev[menuName], anchorEl: null } }))
  }

  const toggleCollapse = () => setCollapse(!collapse)

  const searchTerm = useDebouncedCallback((filterType, search) => {
    filterDispatch({ type: filterType, payload: { search } })
  }, 400)

  const filterTerm = useDebouncedCallback((filterType, search) => {
    const { backup, value } = filterState[filterType]

    const filtered = backup.filter(v => v[value].toLowerCase().includes(search.toLowerCase()))
    filterDispatch({ type: filterType, payload: { values: filtered } })
  }, 400)

  const filterApplied = useMemo(
    () => Object.values(menuState).reduce((applied, value) => (applied += value.selected.size), 0),
    [menuState]
  )

  // * Filter actions methods
  const toggleSelectionAll = filterKey => {
    const { values, key, value } = filterState[filterKey]
    const selected = menuState[filterKey].selected
    if (selected.size === values.length) {
      setMenuState(prev => ({ ...prev, [filterKey]: { ...prev[filterKey], selected: new Map() } }))
      dispatch(updateFilters({ type: filterKey, payload: '' }))

      return
    }

    const selectAll = []
    values.forEach(v => {
      selectAll.push([v[key], v[value]])
    })

    const selectAllMap = new Map(selectAll)

    setMenuState(prev => ({ ...prev, [filterKey]: { ...prev[filterKey], selected: selectAllMap } }))
    dispatch(updateFilters({ type: filterKey, payload: Array.from(selectAllMap.keys()).join(',') }))
  }

  const deleteSelectedFilter = (filterKey, key) => {
    const selected = menuState[filterKey].selected
    selected.delete(key)
    setMenuState(prev => ({ ...prev, [filterKey]: { ...prev[filterKey], selected } }))
    dispatch(updateFilters({ type: filterKey, payload: Array.from(selected.keys()).join(',') }))
  }

  const handleSelectedFilter = (filterKey, key, value) => {
    const selected = menuState[filterKey].selected
    if (selected.has(key)) {
      selected.delete(key)
    } else {
      selected.set(key, value)
    }

    setMenuState(prev => ({ ...prev, [filterKey]: { ...prev[filterKey], selected } }))

    dispatch(updateFilters({ type: filterKey, payload: Array.from(selected.keys()).join(',') }))
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
      const companies = responseCompanies.data.companies
      filterDispatch({ type: 'companyIds', payload: { values: companies, backup: companies } })

      const selectedCompany = companies.map(company => [company['companyId'], company['companyName']])

      const selected = new Map(selectedCompany)

      dispatch(updateFilters({ type: 'companyIds', payload: Array.from(selected.keys()).join(',') }))
      setMenuState(prev => ({ ...prev, companyIds: { ...prev.companyIds, selected } }))
    } catch (error) {
      console.error('Error in fetchCompany :', error)
    }
  }, [clientId, dispatch])

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

  const fetchPrintPublication = useCallback(
    async pb => {
      if (!pb) return
      try {
        const storedToken = localStorage.getItem('accessToken')
        const searchTerm = filterState.publication.search

        const params = {
          clientId,
          searchTerm: searchTerm && searchTerm.length >= 3 ? searchTerm : undefined,
          pb
        }

        // Fetch publication
        const publicationResponse = await axios.get(`${BASE_URL}/printMediaListV1`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          params
        })
        filterDispatch({ type: 'publication', payload: { values: publicationResponse.data.mediaList } })
      } catch (error) {
        console.error('Error in fetchMedia :', error)
      }
    },
    [clientId, filterState.publication.search]
  )

  const fetchOnlinePublication = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      const searchTerm = filterState.publication.search

      const params = {
        searchTerm: searchTerm && searchTerm.length >= 3 ? searchTerm : undefined
      }

      // Fetch publication
      const publicationResponse = await axios.get(`${BASE_URL}/onlineMediaList`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params
      })
      filterDispatch({ type: 'publication', payload: { values: publicationResponse.data.mediaList } })
    } catch (error) {
      console.error('Error in fetchMedia :', error)
    }
  }, [filterState.publication.search])

  const fetchAllPublication = useCallback(
    async pb => {
      if (!pb) return
      try {
        const storedToken = localStorage.getItem('accessToken')
        const searchTerm = filterState.publication.search

        const params = {
          clientId,
          searchTerm: searchTerm && searchTerm.length >= 3 ? searchTerm : undefined,
          pb
        }

        // Fetch publication
        const publicationResponse = await axios.get(`${BASE_URL}/printOnlineMediaListV1`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          params
        })
        filterDispatch({ type: 'publication', payload: { values: publicationResponse.data.mediaList } })
      } catch (error) {
        console.error('Error in fetchMedia :', error)
      }
    },
    [clientId, filterState.publication.search]
  )

  const fetchPublicationGroup = useCallback(
    async ed => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const searchTerm = filterState.publicationGroup.search

        const params = {
          clientId,
          searchTerm: searchTerm && searchTerm.length >= 3 ? searchTerm : undefined,
          ed
        }

        // Fetch publication
        const publicationGroup = await axios.get(`${BASE_URL}/pubGroupListV1`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          params
        })
        filterDispatch({ type: 'publicationGroup', payload: { values: publicationGroup.data.mediaList } })
      } catch (error) {
        console.error('Error in fetchPublicationGroup :', error)
      }
    },
    [clientId, filterState.publicationGroup.search]
  )

  const fetchMedia = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const response = await axios.get(`${BASE_URL}/publicationCategoryAllList/`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      filterDispatch({ type: 'media', payload: { values: response.data.publicationsTypeList } })
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

      const geography = citiesResponse.data.cities

      filterDispatch({ type: 'geography', payload: { values: geography, backup: geography } })
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
        },
        params: { searchTerm: filterState.language.search }
      })

      const language = languageResponse.data.languages
      filterDispatch({ type: 'language', payload: { values: language, backup: language } })
    } catch (error) {
      console.error('Error in fetchLanguage :', error)
    }
  }, [filterState.language.search])

  const fetchTheme = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const response = await axios.get(`${BASE_URL}/reportingSubjectList`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params: { clientId }
      })

      const themes = response.data.reportingSubjects

      filterDispatch({ type: 'theme', payload: { values: themes, backup: themes } })
    } catch (error) {
      console.error('Error in fetchTags :', error)
    }
  }, [clientId])

  const fetchTags = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const tagsResponse = await axios.get(`${BASE_URL}/getTagListForClient`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params: { clientId, searchTerm: filterState.tags.search }
      })

      filterDispatch({ type: 'tags', payload: { values: tagsResponse.data.clientTags } })
    } catch (error) {
      console.error('Error in fetchTags :', error)
    }
  }, [clientId, filterState.tags.search])

  // * useEffect hooks
  useEffect(() => {
    fetchCompany()
  }, [fetchCompany])

  useEffect(() => {
    fetchEditionType()
  }, [fetchEditionType])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  useEffect(() => {
    if (publicationGroup) fetchPrintPublication(publicationGroup)
  }, [fetchPrintPublication, publicationGroup])
  useEffect(() => {
    if (media.includes('L')) fetchOnlinePublication()
  }, [fetchOnlinePublication, media])
  useEffect(() => {
    fetchAllPublication()
  }, [fetchAllPublication])

  useEffect(() => {
    if (editionType) fetchPublicationGroup(editionType)
  }, [fetchPublicationGroup, editionType])

  useEffect(() => {
    fetchCities()
  }, [fetchCities])

  useEffect(() => {
    fetchLanguage()
  }, [fetchLanguage])

  useEffect(() => {
    fetchTheme()
  }, [fetchTheme])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return (
    <Box py={2}>
      <Stack direction='row' gap={2} flexWrap='wrap'>
        {filterNames.map(filterKey => {
          return (
            <Fragment key={filterKey}>
              <Button
                variant={'text'}
                sx={{
                  py: 0.5,
                  px: 2,
                  borderRadius: 2,
                  color: menuState[filterKey].selected.size > 0 ? 'text.primary' : 'text.secondary',
                  fontWeight: menuState[filterKey].selected.size > 0 ? 700 : 500
                }}
                endIcon={<KeyboardArrowDownIcon fontSize='small' />}
                onClick={e => {
                  openMenu(e, filterKey)
                }}
              >
                {defaultFilter[filterKey].title}
              </Button>

              <FilterMenu
                anchorEl={menuState[filterKey].anchorEl}
                open={Boolean(menuState[filterKey].anchorEl)}
                onClose={() => closeMenu(filterKey)}
                toggleSelection={() => toggleSelectionAll(filterKey)}
                checked={menuState[filterKey].selected.size === filterState[filterKey].values.length}
                search={{
                  display: 'search' in filterState[filterKey] || 'filter' in filterState[filterKey],
                  props: {
                    onChange: e => {
                      const value = e.target.value
                      'search' in filterState[filterKey] ? searchTerm(filterKey, value) : filterTerm(filterKey, value)
                    }
                  }
                }}
              >
                {filterState[filterKey].values.map(val => {
                  const key = val[filterState[filterKey].key]
                  const value = val[filterState[filterKey].value]

                  return (
                    <MenuItem
                      key={value}
                      onClick={() => {
                        handleSelectedFilter(filterKey, key, value)
                      }}
                      selected={menuState[filterKey]?.selected?.has(key)}
                      sx={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '1',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {value}
                    </MenuItem>
                  )
                })}
              </FilterMenu>
            </Fragment>
          )
        })}
      </Stack>

      <Slide direction='up' in={filterApplied} mountOnEnter unmountOnExit>
        <Box
          position='fixed'
          bottom={25}
          display='flex'
          justifyContent='center'
          alignItems='center'
          left={{ xs: 0, lg: 260 }}
          right={0}
          zIndex={1400}
        >
          <Card
            sx={{
              width: 'min(776px, 95%)',
              borderRadius: 2,
              boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemButton onClick={toggleCollapse}>
              <Stack direction='row' justifyContent='space-between' alignItems='center' width={'100%'} spacing={2}>
                <FilterAltIcon />
                <Typography variant='subtitle1' color='primary.main' fontWeight={500}>
                  FILTER
                </Typography>

                {collapse ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowUpIcon size='small' />}
              </Stack>
            </ListItemButton>
            <Collapse direction='up' in={collapse}>
              <Box px={2} py={1} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' width={'100%'} spacing={2}>
                  <Typography variant='subtitle2'>Filters</Typography>

                  <Button
                    color='primary'
                    sx={{ py: 0.1 }}
                    onClick={() => {
                      setMenuState(createMenuState())
                      dispatch(setInitialState())
                    }}
                  >
                    Clear all
                  </Button>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {Object.keys(menuState).map(menu => {
                  if (menuState[menu].selected.size === 0) return null

                  return (
                    <Fragment key={menu}>
                      <Typography variant='subtitle1' fontWeight={500} gutterBottom>
                        {filterState[menu].title}
                      </Typography>

                      <Stack direction='row' gap={3} mb={2} flexWrap='wrap'>
                        {Array.from(menuState[menu].selected.entries()).map(([key, value]) => (
                          <Chip
                            label={value}
                            key={key}
                            size='small'
                            variant='outlined'
                            sx={{
                              backgroundColor: 'background.default',
                              borderRadius: '6px',
                              px: 0.2,
                              borderColor: 'divider',
                              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;'
                            }}
                            onDelete={() => deleteSelectedFilter(menu, key)}
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
