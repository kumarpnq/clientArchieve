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
import { selectSelectedClient, selectShortCut } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'
import { TextField } from '@mui/material'
import useDebounce from 'src/hooks/useDebounce'

const ToolbarComponent = ({
  selectedMedia,
  setSelectedMedia,
  selectedTag,
  setSelectedTag,
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
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermtags, setSearchTermtags] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const shortCutData = useSelector(selectShortCut)

  const handleSelectAllMedia = () => {
    const allMediaIds = media.map((item, index) => item.publicationId + index)
    setSelectedMedia(allMediaIds)
  }

  const handleSelectAllTags = () => {
    const allTags = tags.map(item => item)
    setSelectedTag(allTags)
  }

  const handleSelectAllCities = () => {
    const allCityIds = cities.map(city => city.cityId)
    setSelectedCities(allCityIds)
  }

  const handleSelectAllLanguage = () => {
    const allLangs = Object.entries(languages).map(([_, languageCode]) => languageCode)
    setSelectedLanguages(allLangs)
  }

  const handleSearchChange = event => {
    console.log('event==>', event.target.value)
    setSearchTerm(event.target.value)
  }

  const handleSearchChangeTags = event => {
    console.log('event==>', event.target.value)
    setSearchTermtags(event.target.value)
  }

  const handleTagSelect = item => {
    setSelectedTag(prevSelected => {
      const isAlreadySelected = prevSelected.includes(item)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(tag => tag !== item)
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

  let index = 0 // This should be outside the component

  const handleMediaSelect = (publicationId, itemIndex) => {
    setSelectedMedia(prevSelected => {
      const isAlreadySelected = prevSelected.includes(publicationId + itemIndex)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== publicationId + itemIndex)
      } else {
        // If not selected, add to the list
        return [...prevSelected, publicationId + itemIndex]
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

        if (shortCutData?.screenName == 'printHeadlines') {
          const selectedLanguageCodes = languageResponse.data.languages
            .filter(languageCode => shortCutData?.searchCriteria?.language?.includes(languageCode.id))
            .map(languageCode => languageCode)

          setSelectedLanguages(selectedLanguageCodes)
        }

        // Fetch cities
        const citiesResponse = await axios.get(`${BASE_URL}/citieslist/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setCities(citiesResponse.data.cities)

        // Pre-select media based on shortCutData
        if (shortCutData?.screenName == 'printHeadlines') {
          const selectedCityIds = citiesResponse.data.cities
            .filter(city => shortCutData?.searchCriteria?.geography?.includes(city.cityId))
            .map(city => city.cityId)
          setSelectedCities(selectedCityIds)
        }

        // Fetch media
        const mediaResponse = await axios.get(`${BASE_URL}/printMediaList`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId,
            searchTerm: debouncedSearchTerm
          }
        })
        setMedia(mediaResponse.data.mediaList)

        // Pre-select media based on shortCutData
        if (shortCutData?.screenName == 'printHeadlines') {
          const selectedMediaIds = mediaResponse.data.mediaList
            .filter(item => shortCutData?.searchCriteria?.media?.includes(item.publicationId))
            .map((item, index) => item.publicationId + index)
          setSelectedMedia(selectedMediaIds)
        }
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      }
    }

    fetchUserDataAndCompanies()
  }, [clientId, selectedClient, debouncedSearchTerm, shortCutData?.searchCriteria?.media])

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        const tagsResponse = await axios.get(`${BASE_URL}/getTagListForClient`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId,
            searchTerm: searchTermtags
          }
        })
        const clientTags = tagsResponse.data.clientTags

        setTags(clientTags)
        if (shortCutData?.screenName == 'printHeadlines') {
          const selectedTagsIds = tagsResponse.data.clientTags.filter(tag =>
            shortCutData?.searchCriteria?.tags?.split(',').includes(tag)
          )
          setSelectedTag(selectedTagsIds)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [clientId, selectedClient, setTags, fetchTagsFlag, searchTermtags])

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
              selected={
                selectedCities.includes(city.cityId) || shortCutData?.searchCriteria?.geography?.includes(city.cityId)
              }
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
              selected={
                selectedLanguages.includes(languageCode) ||
                shortCutData?.searchCriteria?.language?.includes(languageCode)
              }
            >
              {languageCode.name}
            </MenuItem>
          ))}
        </Menu>
        {/* Media Dropdown Menu */}
        <Menu open={Boolean(mediaAnchor)} anchorEl={mediaAnchor} onClose={() => closeDropdown(setMediaAnchor)}>
          {
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllMedia}>Select All</Button>
              <Button onClick={() => setSelectedMedia([])}>Deselect All</Button>
            </ListItem>
          }

          {
            <ListItem>
              <TextField placeholder='Search Media' value={searchTerm} onChange={handleSearchChange} />
            </ListItem>
          }
          {media.map((item, index) => (
            <div key={`${item.publicationId}-${index}`}>
              <MenuItem
                onClick={() => handleMediaSelect(item.publicationId, index)}
                selected={
                  selectedMedia.includes(item.publicationId + index) ||
                  shortCutData?.searchCriteria?.media?.includes(item.publicationId)
                }
              >
                {item.publicationName}
              </MenuItem>
            </div>
          ))}
          {/* Add more items as needed */}
        </Menu>
        {/* Tags Dropdown Menu */}

        <Menu open={Boolean(tagsAnchor)} anchorEl={tagsAnchor} onClose={() => closeDropdown(setTagsAnchor)}>
          {
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllTags}>Select All</Button>
              <Button onClick={() => setSelectedTag([])}>Deselect All</Button>
            </ListItem>
          }

          {
            <ListItem>
              <TextField placeholder='Search Tags' value={searchTermtags} onChange={handleSearchChangeTags} />
            </ListItem>
          }
          {tags?.map((item, index) => (
            <div key={`${index}`}>
              <MenuItem
                onClick={() => handleTagSelect(item)}
                selected={selectedTag.includes(item) || shortCutData?.searchCriteria?.tags?.includes(item)}
              >
                {item}
              </MenuItem>
            </div>
          ))}
          {/* Add more items as needed */}
        </Menu>

        {/* Repeat similar patterns for other dropdown menus */}
      </Toolbar>
    </AppBar>
  )
}

export default ToolbarComponent
