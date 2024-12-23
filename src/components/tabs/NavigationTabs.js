import { styled } from '@mui/material/styles'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import React from 'react'

const NavigationTabs = styled(props => (
  <MuiTabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />
))(({ theme }) => ({
  minHeight: theme.spacing(4),
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  '& .MuiTabs-scrollButtons.Mui-disabled': {
    opacity: 0.3
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    width: '65%',
    backgroundColor: theme.palette.secondary.main
  }
}))

const Tab = styled(props => <MuiTab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(16),
  marginRight: theme.spacing(1),
  padding: 0,
  minHeight: theme.spacing(8),
  '&.Mui-selected': {
    color: theme.palette.text.primary,
    fontWeight: 'bold'
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)'
  }
}))

function TabPanel(props) {
  const { children, value, index, ...rest } = props

  return (
    <Box role='tabpanel' hidden={value !== index} className='cancelSelection' width='100%' {...rest}>
      {value === index && children}
    </Box>
  )
}

export { NavigationTabs, Tab, TabPanel }
