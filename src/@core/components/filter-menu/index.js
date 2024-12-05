import OutlinedInput from '@mui/material/OutlinedInput'
import Card from '@mui/material/Card'
import MuiMenu from '@mui/material/Menu'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'

function Menu(props) {
  const { search = false, children, ...rest } = props

  return (
    <MuiMenu
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
      {...rest}
    >
      {search && (
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
          maxHeight: 450,
          overflow: 'auto',

          // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {children}
      </Card>
    </MuiMenu>
  )
}

export default Menu
