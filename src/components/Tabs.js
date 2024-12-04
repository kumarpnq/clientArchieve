import { styled } from '@mui/material/styles'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import React from 'react'

const Tabs = styled(props => (
  <MuiTabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />
))(({ theme }) => ({
  // [theme.breakpoints.down('sm')]: {
  width: '100%',

  // },
  marginTop: 24,
  minHeight: theme.spacing(4),
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  transition: 'all ease-in-out 0.3s',

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
    backgroundColor: theme.palette.primary.main
  }
}))

const Tab = styled(props => <MuiTab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: 500,
  fontSize: theme.typography.pxToRem(16),
  marginInline: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    marginInline: theme.spacing(5)
  },
  padding: 0,
  '&.Mui-selected': {
    color: theme.palette.primary
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)'
  }
}))

function TabPanel(props) {
  const { children, value, index } = props

  return (
    <div role='tabpanel' hidden={value !== index} className='cancelSelection' style={{ width: '100%' }}>
      {value === index && children}
    </div>
  )
}

export { Tabs, Tab, TabPanel }
