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
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

const ToolbarComponent = ({
  selectedMedia,
  setSelectedMedia,
  selectedTag,
  setSelectedTags,
  selectedCities,
  setSelectedCities,
  selectedLanguages,
  setSelectedLanguages,
  tags,
  setTags,
  fetchTagsFlag
}) => {
  const [geographyAnchor, setGeographyAnchor] = useState(null)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [mediaAnchor, setMediaAnchor] = useState(null)
  const [tagsAnchor, setTagsAnchor] = useState(null)

  // data states for mapping
  const [languages, setLanguages] = useState({})
  const [cities, setCities] = useState([])
  const [media, setMedia] = useState([])

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

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

  const handleSelectAllLanguage = () => {
    const allLangs = Object.entries(languages).map(([_, languageCode]) => languageCode)
    setSelectedLanguages(allLangs)
  }

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

  const handleLanguageSelect = languageCode => {
    setSelectedLanguages(prevSelected => {
      const isAlreadySelected = prevSelected.includes(languageCode)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== languageCode)
      } else {
        // If not selected, add to the list
        return [...prevSelected, languageCode]
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

  // const [userData, setUserData] = useState({
  //   email: '',
  //   fullName: '',
  //   clientId: '',
  //   clientName: '',
  //   role: ''
  // })

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

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
          {Object.entries(languages).length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllLanguage}>Select All</Button>
              <Button onClick={() => setSelectedLanguages([])}>Deselect All</Button>
            </ListItem>
          )}
          {Object.entries(languages).map(([languageName, languageCode]) => (
            <MenuItem
              key={languageCode}
              onClick={() => handleLanguageSelect(languageCode)}
              selected={selectedLanguages.includes(languageCode)}
            >
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
