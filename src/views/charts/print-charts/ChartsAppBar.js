import React, { useEffect, useState } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'
import DateRangeIcon from '@mui/icons-material/DateRange'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import axios from 'axios'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

const ChartsAppBar = ({ selectedDateRange, setSelectedDateRange, selectedCity, setSelectedCity }) => {
  const [dateMenuAnchorEl, setDateMenuAnchorEl] = useState(null)
  const [citiesMenuAnchorEl, setCitiesMenuAnchorEl] = useState(null)
  const [city, setCity] = useState([])

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const handleDateMenuOpen = event => {
    setDateMenuAnchorEl(event.currentTarget)
  }

  const handleDateMenuClose = () => {
    setDateMenuAnchorEl(null)
  }

  const handleCitiesMenuOpen = event => {
    setCitiesMenuAnchorEl(event.currentTarget)
  }

  const handleCitiesMenuClose = () => {
    setCitiesMenuAnchorEl(null)
  }

  const handleMenuItemClick = range => {
    setSelectedDateRange(range)
    handleDateMenuClose()
  }

  const handleCityChange = city => {
    setSelectedCity(city)
  }

  const handleSelectAllCity = () => {
    const allCity = city.map(item => item.cityId)
    setSelectedCity(allCity)
  }

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          // Fetch cities
          const citiesResponse = await axios.get(`${BASE_URL}/citieslist/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          setCity(citiesResponse.data.cities)
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
      }
    }

    fetchCities()
  }, [clientId])

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit' component='div' sx={{ flexGrow: 1 }}>
          Charts
        </Typography>

        {/* Date range icon */}
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          aria-label='select date range'
          aria-controls='date-range-menu'
          aria-haspopup='true'
          onClick={handleDateMenuOpen}
          sx={{ mr: 10 }}
        >
          <DateRangeIcon />
        </IconButton>

        {/* City icon */}
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          aria-label='select cities'
          aria-controls='cities-menu'
          aria-haspopup='true'
          onClick={handleCitiesMenuOpen}
          sx={{ mr: 10 }}
        >
          <LocationCityIcon />
        </IconButton>

        {/* Date range menu */}
        <Menu
          id='date-range-menu'
          anchorEl={dateMenuAnchorEl}
          open={Boolean(dateMenuAnchorEl)}
          onClose={handleDateMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick('today')} selected={selectedDateRange === 'today'}>
            Today
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('lastWeek')} selected={selectedDateRange === 'lastWeek'}>
            Last Week
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('lastMonth')} selected={selectedDateRange === 'lastMonth'}>
            Last Month
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick('lastThreeMonth')}
            selected={selectedDateRange === 'lastThreeMonth'}
          >
            Last 3 Months
          </MenuItem>
        </Menu>

        {/* Cities menu */}
        <Menu open={Boolean(citiesMenuAnchorEl)} anchorEl={citiesMenuAnchorEl} onClose={handleCitiesMenuClose}>
          {city.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllCity}>Select All</Button>
              <Button onClick={() => setSelectedCity([])}>Deselect All</Button>
            </ListItem>
          )}
          {city.map(city => (
            <MenuItem
              key={city.cityId}
              onClick={() => handleCityChange(city.cityId)}
              selected={selectedCity.includes(city.cityId)}
            >
              {city.cityName}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default ChartsAppBar
