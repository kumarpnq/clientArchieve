import { styled } from '@mui/material/styles'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import React from 'react'

const Tabs = styled(props => (
  <MuiTabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />
))(({ theme }) => ({
  width: '100%',
  minHeight: theme.spacing(4),
  border: 'none !important',
  transition: 'all ease-in-out 0.3s',

  '& .MuiTabs-scrollButtons.Mui-disabled': {
    opacity: 0.3
  },

  '& .MuiTabs-indicator': {
    // display: 'none'
    borderRadius: '8px',
    height: '100%',

    // backgroundColor: theme.palette.customColors.tableHeaderBg,
    border: '1px solid',
    backgroundColor: '#f5f2fe',
    borderColor: '#a488f33b'
  }

  // '& .MuiTabs-indicatorSpan': {
  //   width: '65%',
  //   height: '100%',
  //   backgroundColor: theme.palette.customColors.tableHeaderBg
  // }
}))

const Tab = styled(props => <MuiTab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'capitalize',
  fontSize: theme.typography.pxToRem(16),
  minWidth: 85,
  minHeight: '100%',
  color: theme.palette.text.secondary,
  zIndex: 100,
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent'
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
