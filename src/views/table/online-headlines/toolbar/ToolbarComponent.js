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
import axios from 'axios'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

const ToolbarComponent = ({
  // selectedCompanyId,
  // setSelectedCompanyId,
  selectedGeography,
  setSelectedGeography,
  selectedLanguage,
  setSelectedLanguage,
  selectedMedia,
  setSelectedMedia,
  selectedTags,
  setSelectedTags,
  tags,
  setTags,
  fetchTagsFlag
}) => {
  // const [competitionAnchor, setCompetitionAnchor] = useState(null)
  const [geographyAnchor, setGeographyAnchor] = useState(null)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [mediaAnchor, setMediaAnchor] = useState(null)
  const [tagsAnchor, setTagsAnchor] = useState(null)
  const [companies, setCompanies] = useState([])
  const [languages, setLanguages] = useState({})
  const [cities, setCities] = useState([])
  const [media, setMedia] = useState([])

  // const [tags, setTags] = useState([])

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : null

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  const handleDropdownItemClick = companyId => {
    setSelectedCompanyId(prevSelected => {
      const isAlreadySelected = prevSelected.includes(companyId)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== companyId)
      } else {
        // If not selected, add to the list
        return [...prevSelected, companyId]
      }
    })
  }

  const handleSelectAllCompetitions = () => {
    const allCompanyIds = companies.map(company => company.companyId)
    setSelectedCompanyId(allCompanyIds)
  }

  const handleSelectAllCities = () => {
    const allGeography = cities.map(city => city.cityId)
    setSelectedGeography(allGeography)
  }

  const handleSelectAllLanguage = () => {
    const allLangs = Object.entries(languages).map(([_, languageCode]) => languageCode)
    setSelectedLanguage(allLangs)
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

  const handleSelectAllTags = () => {
    const allTags = tags.map(item => item)
    setSelectedTags(allTags)
  }

  const handleSelectAllMedia = () => {
    const allMediaIds = media.map(item => item.publicationGroupId)
    setSelectedMedia(allMediaIds)
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
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        // if (storedToken) {
        //   const response = await axios.get('http://51.68.220.77:8001/companyListByClient/', {
        //     headers: {
        //       Authorization: `Bearer ${storedToken}`
        //     },
        //     params: {
        //       clientId: clientId
        //     }
        //   })
        //   setCompanies(response.data.companies)
        // }

        // Fetch languages
        const languageResponse = await axios.get('http://51.68.220.77:8001/languagelist/', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setLanguages(languageResponse.data.languages)

        // Fetch cities
        const citiesResponse = await axios.get('http://51.68.220.77:8001/citieslist/', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        setCities(citiesResponse.data.cities)

        // fetch media
        const mediaResponse = await axios.get('http://51.68.220.77:8001/printMediaList', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setMedia(mediaResponse.data.mediaList)

        // // fetch tags
        // const tagsResponse = await axios.get('http://51.68.220.77:8001/getTagsForOnlineArticle', {
        //   headers: {
        //     Authorization: `Bearer ${storedToken}`
        //   },
        //   params: {
        //     clientId: clientId
        //   }
        // })
        // setTags(tagsResponse?.data?.clientTags)
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      }
    }

    fetchUserDataAndCompanies()
  }, [clientId])

  useEffect(() => {
    const fetchTags = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        const tagsResponse = await axios.get(`${BASE_URL}/getTagsForOnlineArticle`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        setTags(tagsResponse.dat.clientTags)
        console.log(tagsResponse.data)
      } catch (error) {
        console.error('Error fetching user tags:', error)
      }
    }
    fetchTags()
  }, [clientId, fetchTagsFlag, setTags])

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

        {/* <Menu
          open={Boolean(competitionAnchor)}
          anchorEl={competitionAnchor}
          onClose={() => closeDropdown(setCompetitionAnchor)}
        >
          {companies.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllCompetitions}>Select All</Button>
              <Button onClick={() => setSelectedCompanyId([])}>Deselect All</Button>
            </ListItem>
          )}

          {companies.map(company => (
            <MenuItem
              key={company.companyId}
              onClick={() => handleDropdownItemClick(company.companyId)}
              selected={selectedCompanyId.includes(company.companyId) || company.companyName === priorityCompanyName}
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
              <Button onClick={() => setSelectedGeography([])}>Deselect All</Button>
            </ListItem>
          )}
          {cities.map(city => (
            <MenuItem
              key={city.cityId}
              onClick={handleDropdownItemClick}
              selected={selectedGeography.includes(city.cityId)}
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
              <Button onClick={() => setSelectedLanguage([])}>Deselect All</Button>
            </ListItem>
          )}
          {Object.entries(languages).map(([languageName, languageCode]) => (
            <MenuItem
              key={languageCode}
              onClick={handleDropdownItemClick}
              selected={selectedLanguage.includes(languageCode)}
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
          {media.map(item => (
            <MenuItem
              key={item.publicationGroupId}
              onClick={() => handleMediaSelect(item.publicationGroupId)}
              selected={selectedMedia.includes(item.publicationGroupId)}
            >
              {item.publicationName}
            </MenuItem>
          ))}
        </Menu>

        <Menu open={Boolean(tagsAnchor)} anchorEl={tagsAnchor} onClose={() => closeDropdown(setTagsAnchor)}>
          {tags.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllTags}>Select All</Button>
              <Button onClick={() => setSelectedTags([])}>Deselect All</Button>
            </ListItem>
          )}
          {tags?.map(item => (
            <MenuItem key={item} onClick={() => handleTagSelect(item)} selected={selectedTags.includes(item)}>
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
