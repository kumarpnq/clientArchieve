import React, { useState, useEffect } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import ListItem from '@mui/material/ListItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import TextField from '@mui/material/TextField'

//**  data hooks import
import useUserDataAndCompanies from 'src/api/print-online-headlines/useToolbarComponentData'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient, selectShortCut } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

// ** third party imports
import axios from 'axios'
import { debounce } from 'lodash'

const ToolbarComponent = ({
  // selectedCompanyId,
  // setSelectedCompanyId,
  setSelectedLanguages,
  selectedGeography,
  setSelectedGeography,
  selectedLanguages,
  selectedMedia,
  setSelectedMedia,
  selectedTag,
  setSelectedTag,
  tags,
  setTags,
  fetchTagsFlag
}) => {
  // const [competitionAnchor, setCompetitionAnchor] = useState(null)
  const [geographyAnchor, setGeographyAnchor] = useState(null)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [mediaAnchor, setMediaAnchor] = useState(null)
  const [tagsAnchor, setTagsAnchor] = useState(null)
  const [searchTermtags, setSearchTermtags] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [languages, setLanguages] = useState({})
  const [cities, setCities] = useState([])
  const [media, setMedia] = useState([])

  const selectedClient = useSelector(selectSelectedClient)
  const shortCutData = useSelector(selectShortCut)

  // const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : null
  const clientId = selectedClient ? selectedClient.clientId : null

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  const handleCityClick = cityId => {
    setSelectedGeography(prevSelected => {
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

  const handleSelectAllCities = () => {
    const allCityIds = cities.map(city => city.cityId)
    setSelectedGeography(allCityIds)
  }

  const handleSelectAllLanguage = () => {
    const allLangs = Object.entries(languages).map(([_, languageCode]) => languageCode)
    setSelectedLanguages(allLangs)
  }

  const handleSelectAllMedia = () => {
    const allMediaIds = media.map(item => item.publicationGroupId)
    setSelectedMedia(allMediaIds)
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

  const handleTagSelect = item => {
    setSelectedTag(prevSelected => {
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

  const handleSearchChangeTags = event => {
    setSearchTermtags(event.target.value)
  }

  const handleSelectAllTags = () => {
    const allTags = tags.map(item => item)
    setSelectedTag(allTags)
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
  }

  const debounceMediaChange = debounce(value => {
    if (value.length > 3) {
      setSelectedMedia(value)
    }
  }, 300)

  const handleMediaChange = e => {
    const { value } = e.target
    setMedia(value)
    debounceMediaChange(value)
  }
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        // Fetch languages
        const languageResponse = await axios.get('http://51.68.220.77:8001/languagelist/', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setLanguages(languageResponse.data.languages)

        if (shortCutData?.screenName == 'bothHeadlines') {
          const selectedLanguageCodes = languageResponse.data.languages
            .filter(languageCode => shortCutData?.searchCriteria?.language?.includes(languageCode.id))
            .map(languageCode => languageCode)

          setSelectedLanguages(selectedLanguageCodes)
        }

        // Fetch cities
        const citiesResponse = await axios.get('http://51.68.220.77:8001/citieslist/', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setCities(citiesResponse.data.cities)

        if (shortCutData?.screenName == 'bothHeadlines') {
          const selectedCityIds = citiesResponse.data.cities
            .filter(city => shortCutData?.searchCriteria?.geography?.includes(city.cityId))
            .map(city => city.cityId)
          setSelectedGeography(selectedCityIds)
        }

        const mediaResponse = await axios.get(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId,
            searchTerm: searchTerm
          }
        })
        setMedia(mediaResponse.data.mediaList)

        if (shortCutData?.screenName == 'bothHeadlines') {
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
  }, [clientId, searchTerm])

  useEffect(() => {
    const fetchTags = async () => {
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
        setTags(tagsResponse.data.clientTags)
        if (shortCutData?.screenName == 'bothHeadlines') {
          const selectedTags = tagsResponse.data.clientTags
            .filter(tag => shortCutData?.searchCriteria?.tags.split(',')?.includes(tag))
            .map(tag => tag)
          setSelectedTags(selectedTags)
        }
      } catch (error) {
        console.error('Error fetching user tags:', error)
      }
    }
    fetchTags()
  }, [clientId, fetchTagsFlag, setTags, searchTermtags])

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

        {/* Geography Dropdown Menu */}
        <Menu
          open={Boolean(geographyAnchor)}
          anchorEl={geographyAnchor}
          onClose={() => closeDropdown(setGeographyAnchor)}
          PaperProps={{ style: { maxHeight: 300 } }}
        >
          {cities.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllCities}>Select All</Button>
              <Button onClick={() => setSelectedGeography([])}>Deselect All</Button>
            </ListItem>
          )}
          {cities.map(city => (
            <MenuItem
              key={city.cityId}
              onClick={() => handleCityClick(city.cityId)}
              selected={
                selectedGeography.includes(city.cityId) ||
                shortCutData?.searchCriteria?.geography?.includes(city.cityId)
              }
            >
              {city.cityName}
            </MenuItem>
          ))}
        </Menu>

        {/* Language Dropdown Menu */}
        <Menu
          open={Boolean(languageAnchor)}
          anchorEl={languageAnchor}
          onClose={() => closeDropdown(setLanguageAnchor)}
          PaperProps={{ style: { maxHeight: 300 } }}
        >
          {Object.entries(languages).length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllLanguage}>Select All</Button>
              <Button onClick={() => ss([])}>Deselect All</Button>
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
        <Menu
          open={Boolean(mediaAnchor)}
          anchorEl={mediaAnchor}
          onClose={() => closeDropdown(setMediaAnchor)}
          PaperProps={{ style: { maxHeight: 300 } }}
        >
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
                  selectedMedia?.includes(item.publicationId + index) ||
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
        <Menu
          open={Boolean(tagsAnchor)}
          anchorEl={tagsAnchor}
          onClose={() => closeDropdown(setTagsAnchor)}
          PaperProps={{ style: { maxHeight: 300 } }}
        >
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
                selected={selectedTag?.includes(item) || shortCutData?.searchCriteria?.tags?.includes(item)}
              >
                {item}
              </MenuItem>
            </div>
          ))}
          {/* Add more items as needed */}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default ToolbarComponent
