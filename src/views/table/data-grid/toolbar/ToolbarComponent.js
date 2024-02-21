import React, { useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'

const ToolbarComponent = () => {
  const [competitionAnchor, setCompetitionAnchor] = useState(null)
  const [geographyAnchor, setGeographyAnchor] = useState(null)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [mediaAnchor, setMediaAnchor] = useState(null)
  const [tagsAnchor, setTagsAnchor] = useState(null)

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  const handleDropdownItemClick = () => {
    console.log('Dropdown item clicked')
    closeDropdown(setCompetitionAnchor)
  }

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  return (
    <AppBar sx={{ position: 'static' }}>
      <Toolbar>
        {isMobile ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={e => openDropdown(e, setCompetitionAnchor)}
                color='inherit'
                fullWidth
              >
                Competition
              </Button>
            </Grid>

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
            <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setCompetitionAnchor)} color='inherit'>
              Competition
            </Button>

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

        {/* Dropdown Menus */}
        <Menu
          open={Boolean(competitionAnchor)}
          anchorEl={competitionAnchor}
          onClose={() => closeDropdown(setCompetitionAnchor)}
        >
          <MenuItem onClick={handleDropdownItemClick}>Item 1</MenuItem>
          <MenuItem onClick={handleDropdownItemClick}>Item 2</MenuItem>
          {/* Add more items as needed */}
        </Menu>
        {/* Geography Dropdown Menu */}
        <Menu
          open={Boolean(geographyAnchor)}
          anchorEl={geographyAnchor}
          onClose={() => closeDropdown(setGeographyAnchor)}
        >
          <MenuItem onClick={handleDropdownItemClick}>Item 1</MenuItem>
          <MenuItem onClick={handleDropdownItemClick}>Item 2</MenuItem>
          {/* Add more items as needed */}
        </Menu>

        {/* Language Dropdown Menu */}
        <Menu open={Boolean(languageAnchor)} anchorEl={languageAnchor} onClose={() => closeDropdown(setLanguageAnchor)}>
          <MenuItem onClick={handleDropdownItemClick}>Item 1</MenuItem>
          <MenuItem onClick={handleDropdownItemClick}>Item 2</MenuItem>
          {/* Add more items as needed */}
        </Menu>

        {/* Media Dropdown Menu */}
        <Menu open={Boolean(mediaAnchor)} anchorEl={mediaAnchor} onClose={() => closeDropdown(setMediaAnchor)}>
          <MenuItem onClick={handleDropdownItemClick}>Item 1</MenuItem>
          <MenuItem onClick={handleDropdownItemClick}>Item 2</MenuItem>
          {/* Add more items as needed */}
        </Menu>

        {/* Tags Dropdown Menu */}
        <Menu open={Boolean(tagsAnchor)} anchorEl={tagsAnchor} onClose={() => closeDropdown(setTagsAnchor)}>
          <MenuItem onClick={handleDropdownItemClick}>Item 1</MenuItem>
          <MenuItem onClick={handleDropdownItemClick}>Item 2</MenuItem>
          {/* Add more items as needed */}
        </Menu>

        {/* Repeat similar patterns for other dropdown menus */}
      </Toolbar>
    </AppBar>
  )
}

export default ToolbarComponent
