import React, { useState, useEffect } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import ListItem from '@mui/material/ListItem'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

const ToolbarComponent = ({
  // selectedCompanyIds,
  // setSelectedCompanyIds,
  selectedMedia,
  setSelectedMedia,
  selectedTag,
  setSelectedTags,
  selectedCities,
  setSelectedCities,
  tags,
  setTags,
  fetchTagsFlag
}) => {
  // const [competitionAnchor, setCompetitionAnchor] = useState(null)
  const [geographyAnchor, setGeographyAnchor] = useState(null)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [mediaAnchor, setMediaAnchor] = useState(null)
  const [tagsAnchor, setTagsAnchor] = useState(null)

  // const [companies, setCompanies] = useState([])
  const [languages, setLanguages] = useState({})
  const [cities, setCities] = useState([])
  const [media, setMedia] = useState([])

  // const [selectAllCompetitions, setSelectAllCompetitions] = useState(false)

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  // const handleSelectAllCompetitions = () => {
  //   const allCompanyIds = companies.map(company => company.companyId)
  //   setSelectedCompanyIds(allCompanyIds)
  // }

  // const handleDeselectAllCompetitions = () => {
  //   setSelectedCompanyIds([])
  // }

  const handleSelectAllMedia = () => {
    const allMediaIds = media.map(item => item.publicationGroupId)
    setSelectedMedia(allMediaIds)
  }

  const handleSelectAllTags = () => {
    const allTags = tags.map(item => item)
    setSelectedTags(allTags)
  }

  const handleSelectAllCities = () => {
    const allCityIds = cities.map(city => city.cityId)
    setSelectedCities(allCityIds)
  }

  // const handleCheckboxChange = companyId => {
  //   setSelectedCompanyIds(prevSelected => {
  //     const isAlreadySelected = prevSelected.includes(companyId)

  //     if (isAlreadySelected) {
  //       // If already selected, remove from the list
  //       return prevSelected.filter(id => id !== companyId)
  //     } else {
  //       // If not selected, add to the list
  //       return [...prevSelected, companyId]
  //     }
  //   })
  // }

  const handleTagSelect = item => {
    setSelectedTags(prevSelected => {
      const isAlreadySelected = prevSelected.includes(item)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== item)
      } else {
        // If not selected, add to the list
        return [...prevSelected, item]
      }
    })
  }

  const handleMediaSelect = publicationGroupId => {
    setSelectedMedia(prevSelected => {
      const isAlreadySelected = prevSelected.includes(publicationGroupId)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== publicationGroupId)
      } else {
        // If not selected, add to the list
        return [...prevSelected, publicationGroupId]
      }
    })
  }

  const handleCitySelect = cityId => {
    setSelectedCities(prevSelected => {
      const isAlreadySelected = prevSelected.includes(cityId)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== cityId)
      } else {
        // If not selected, add to the list
        return [...prevSelected, cityId]
      }
    })
  }

  const [userData, setUserData] = useState({
    email: '',
    fullName: '',
    clientId: '',
    clientName: '',
    role: ''
  })

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  const handleDropdownItemClick = () => {}

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        // if (storedToken) {
        //   // Fetch companies
        //   const response = await axios.get('http://51.68.220.77:8001/companyListByClient/', {
        //     headers: {
        //       Authorization: `Bearer ${storedToken}`
        //     },
        //     params: {
        //       clientId: clientId
        //     }
        //   })

        //   const fetchedCompanies = response.data.companies
        //   setCompanies(fetchedCompanies)

        //   // Set default selectedCompanyIds based on priorityCompanyId
        //   const priorityCompanyId = selectedClient ? selectedClient.priorityCompanyId : null
        //   if (priorityCompanyId && fetchedCompanies.some(company => company.companyId === priorityCompanyId)) {
        //     setSelectedCompanyIds([priorityCompanyId])
        //   }
        // }

        // Fetch languages
        const languageResponse = await axios.get(`${BASE_URL}/languagelist/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setLanguages(languageResponse.data.languages)

        // Fetch cities
        const citiesResponse = await axios.get(`${BASE_URL}/citieslist/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setCities(citiesResponse.data.cities)

        // Fetch media
        const mediaResponse = await axios.get(`${BASE_URL}/printMediaList`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setMedia(mediaResponse.data.mediaList)

        // // Fetch tags
        // const tagsResponse = await axios.get(`${BASE_URL}/getTagListForClient`, {
        //   headers: {
        //     Authorization: `Bearer ${storedToken}`
        //   },
        //   params: {
        //     clientId: clientId
        //   }
        // })
        // setTags(tagsResponse.data.clientTags)
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      }
    }

    fetchUserDataAndCompanies()
  }, [clientId, selectedClient])
  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        const tagsResponse = await axios.get(`${BASE_URL}/getTagListForClient`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setTags(tagsResponse.data.clientTags)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [clientId, selectedClient, setTags, fetchTagsFlag])

  return (
    <AppBar sx={{ position: 'static' }}>
      <Toolbar>
        {isMobile ? (
          <Grid container spacing={2}>
            {/* <Grid item xs={6}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={e => openDropdown(e, setCompetitionAnchor)}
                color='inherit'
                fullWidth
              >
                Competition
              </Button>
            </Grid> */}

            <Grid item xs={6}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={e => openDropdown(e, setGeographyAnchor)}
                color='inherit'
                fullWidth
              >
                Geography
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={e => openDropdown(e, setLanguageAnchor)}
                color='inherit'
                fullWidth
              >
                Language
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={e => openDropdown(e, setMediaAnchor)}
                color='inherit'
                fullWidth
              >
                Media
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={e => openDropdown(e, setTagsAnchor)}
                color='inherit'
                fullWidth
              >
                Tags
              </Button>
            </Grid>
          </Grid>
        ) : (
          <>
            {/* <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setCompetitionAnchor)} color='inherit'>
              Competition
            </Button> */}

            <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setGeographyAnchor)} color='inherit'>
              Geography
            </Button>

            <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setLanguageAnchor)} color='inherit'>
              Language
            </Button>

            <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setMediaAnchor)} color='inherit'>
              Media
            </Button>

            <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setTagsAnchor)} color='inherit'>
              Tags
            </Button>
          </>
        )}

        {/* Competition Dropdown Menu */}
        {/* <Menu
          open={Boolean(competitionAnchor)}
          anchorEl={competitionAnchor}
          onClose={() => closeDropdown(setCompetitionAnchor)}
        >
          {companies.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllCompetitions}>Select All</Button>
              <Button onClick={handleDeselectAllCompetitions}>Deselect All</Button>
            </ListItem>
          )}

          {companies.map(company => (
            <MenuItem
              key={company.companyId}
              onClick={() => handleCheckboxChange(company.companyId)}
              selected={selectedCompanyIds.includes(company.companyId)}
            >
              {company.companyName}
            </MenuItem>
          ))}
        </Menu> */}

        {/* Geography Dropdown Menu */}
        <Menu
          open={Boolean(geographyAnchor)}
          anchorEl={geographyAnchor}
          onClose={() => closeDropdown(setGeographyAnchor)}
        >
          {cities.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllCities}>Select All</Button>
              <Button onClick={() => setSelectedCities([])}>Deselect All</Button>
            </ListItem>
          )}
          {cities.map((city, index) => (
            <MenuItem
              key={`${city.cityId}-${index}`}
              onClick={() => handleCitySelect(city.cityId)}
              selected={selectedCities.includes(city.cityId)}
            >
              {city.cityName}
            </MenuItem>
          ))}
        </Menu>

        {/* Language Dropdown Menu */}
        <Menu open={Boolean(languageAnchor)} anchorEl={languageAnchor} onClose={() => closeDropdown(setLanguageAnchor)}>
          {Object.entries(languages).map(([languageName, languageCode]) => (
            <MenuItem key={languageCode} onClick={handleDropdownItemClick}>
              {languageName}
            </MenuItem>
          ))}
        </Menu>
        {/* Media Dropdown Menu */}
        <Menu open={Boolean(mediaAnchor)} anchorEl={mediaAnchor} onClose={() => closeDropdown(setMediaAnchor)}>
          {media.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllMedia}>Select All</Button>
              <Button onClick={() => setSelectedMedia([])}>Deselect All</Button>
            </ListItem>
          )}
          {media.map((item, index) => (
            <MenuItem
              key={`${item.publicationGroupId}-${index}`}
              onClick={() => handleMediaSelect(item.publicationGroupId)}
              selected={selectedMedia.includes(item.publicationGroupId)}
            >
              {item.publicationName}
            </MenuItem>
          ))}
          {/* Add more items as needed */}
        </Menu>
        {/* Tags Dropdown Menu */}

        <Menu open={Boolean(tagsAnchor)} anchorEl={tagsAnchor} onClose={() => closeDropdown(setTagsAnchor)}>
          {tags.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllTags}>Select All</Button>
              <Button onClick={() => setSelectedTags([])}>Deselect All</Button>
            </ListItem>
          )}
          {tags?.map((item, index) => (
            <MenuItem
              key={`${item}-${index}`}
              onClick={() => handleTagSelect(item)}
              selected={selectedTag.includes(item)}
            >
              {item}
            </MenuItem>
          ))}
          {/* Add more items as needed */}
        </Menu>

        {/* Repeat similar patterns for other dropdown menus */}
      </Toolbar>
    </AppBar>
  )
}

export default ToolbarComponent
