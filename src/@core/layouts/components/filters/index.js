import filters from 'src/data/filter.json'
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  ListItemButton,
  Menu,
  MenuItem,
  OutlinedInput,
  Slide,
  Stack,
  Typography
} from '@mui/material'
import React, { Fragment, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CloseIcon from '@mui/icons-material/Close'

const filterNames = Object.keys(filters)

function createMenuState() {
  const menuItems = {}
  filterNames.forEach(key => {
    if (filters[key] !== null) menuItems[key] = { anchorEl: null, selected: [] }
  })

  return menuItems
}

function Filter() {
  const [menuState, setMenuState] = useState(() => createMenuState())
  const [mapData, setMapData] = useState(new Map())
  const [collapse, setCollapse] = useState(false)

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

  return (
    <Box py={2} px={3}>
      <Stack direction='row' gap={2} flexWrap='wrap'>
        {filterNames.map(filter => (
          <Fragment key={filter}>
            <Button
              variant='text'
              sx={{ py: 0.5, px: 1, borderRadius: 2, color: 'text.secondary' }}
              endIcon={filter in menuState ? <KeyboardArrowDownIcon fontSize='small' /> : null}
              onClick={e => {
                if (filter in menuState) openMenu(e, filter)
              }}
            >
              {filter}
            </Button>
            {filter in menuState && (
              <Menu
                anchorEl={menuState[filter].anchorEl}
                open={Boolean(menuState[filter].anchorEl)}
                onClose={() => closeMenu(filter)}
                disableScrollLock
                sx={{
                  '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
                    width: 'min(100%, 380px)',
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                  },
                  '& .MuiButtonBase-root:hover': {
                    backgroundColor: 'background.default'
                  }
                }}
              >
                {filters[filter]?.search && (
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
                      mb: 1
                    }}
                  >
                    <OutlinedInput
                      fullWidth
                      size='small'
                      placeholder='Search'
                      startAdornment={<SearchIcon fontSize='small' sx={{ color: 'text.tertiary' }} />}
                      sx={{ borderRadius: 2, '& .MuiInputBase-input.MuiOutlinedInput-input': { pl: 1 } }}
                    />
                  </Card>
                )}
                <Card
                  elevation={0}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
                    backdropFilter: 'blur(2px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',

                    // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {filters[filter]?.values.map(item => (
                    <MenuItem
                      key={item}
                      onClick={() => {
                        handleSelection(item, item)
                        handleSelectedFilter(filter, item)
                      }}
                      selected={mapData?.has(item)}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Card>
              </Menu>
            )}
          </Fragment>
        ))}
      </Stack>

      <Slide direction='up' in={mapData.size > 0} mountOnEnter unmountOnExit>
        <Box
          position='fixed'
          bottom={25}
          display='flex'
          justifyContent='center'
          alignItems='center'
          right={0}
          left={260}
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
