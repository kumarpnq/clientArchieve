import { useState } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer from '@mui/material/Drawer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CloseIcon from '@mui/icons-material/Close'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useRouter } from 'next/router'
import { Tooltip } from 'chart.js'
import { Grid, Stack, tooltipClasses } from '@mui/material'

const Toggler = styled(Box)(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 4)
}))

const ColorBox = styled(Box)(({ theme }) => ({
  width: 45,
  height: 45,
  cursor: 'pointer',
  margin: theme.spacing(2.5, 1.75, 1.75),
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })
)

const Overview = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // ** Hook
  const { settings, saveSettings } = useSettings()

  // ** Vars
  const {
    mode,
    skin,
    appBar,
    footer,
    layout,
    navHidden,
    direction,
    appBarBlur,
    themeColor,
    navCollapsed,
    contentWidth,
    verticalNavToggleType
  } = settings

  const handleChange = (field, value) => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div>
      <CustomizerSpacing className='customizer-body' style={{ paddingTop: 25 }}>
        {/* Mode */}
        <Grid container spacing={{ xs: 4, md: 10, lg: 16 }} alignItems='center'>
          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              UI Skin
            </Typography>
            <Typography variant='body2' fontSize={13} mb={6}>
              Select or Customize your UI skin
            </Typography>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <RadioGroup
              row
              value={skin}
              sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              onChange={e => handleChange('skin', e.target.value)}
            >
              <FormControlLabel value='default' label='Default' control={<Radio />} />
              <FormControlLabel value='bordered' label='Bordered' control={<Radio />} />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              Interface theme
            </Typography>
            <Typography variant='body2' fontSize={13} mb={6}>
              Select or Customize your UI theme
            </Typography>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <RadioGroup
              row
              value={mode}
              onChange={e => handleChange('mode', e.target.value)}
              sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
            >
              <FormControlLabel value='light' label='Light' control={<Radio />} />
              <FormControlLabel value='dark' label='Dark' control={<Radio />} />
              {layout === 'horizontal' ? null : (
                <FormControlLabel value='semi-dark' label='Semi Dark' control={<Radio />} />
              )}
            </RadioGroup>
          </Grid>

          {/* Color Picker */}
          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              Theme color
            </Typography>
            <Typography variant='body2' fontSize={13} mb={6}>
              Select or Customize your UI theme color
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} lg={9} display='flex'>
            <ColorBox
              onClick={() => handleChange('themeColor', 'primary')}
              sx={{
                backgroundColor: '#7367F0',
                ...(themeColor === 'primary' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
              }}
            />
            <ColorBox
              onClick={() => handleChange('themeColor', 'secondary')}
              sx={{
                backgroundColor: 'secondary.main',
                ...(themeColor === 'secondary'
                  ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                  : {})
              }}
            />
            <ColorBox
              onClick={() => handleChange('themeColor', 'success')}
              sx={{
                backgroundColor: 'success.main',
                ...(themeColor === 'success' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
              }}
            />
            <ColorBox
              onClick={() => handleChange('themeColor', 'error')}
              sx={{
                backgroundColor: 'error.main',
                ...(themeColor === 'error' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
              }}
            />
            <ColorBox
              onClick={() => handleChange('themeColor', 'warning')}
              sx={{
                backgroundColor: 'warning.main',
                ...(themeColor === 'warning' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
              }}
            />
            <ColorBox
              onClick={() => handleChange('themeColor', 'info')}
              sx={{
                backgroundColor: 'info.main',
                ...(themeColor === 'info' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
              }}
            />
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              Layout
            </Typography>
            <Typography variant='body2' fontSize={13}>
              Customize your layout space
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <RadioGroup
              row
              value={contentWidth}
              sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              onChange={e => handleChange('contentWidth', e.target.value)}
            >
              <FormControlLabel value='full' label='Full' control={<Radio />} />
              <FormControlLabel value='boxed' label='Boxed' control={<Radio />} />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              Appbar transparent
            </Typography>
            <Typography variant='body2' fontSize={13}>
              Make your appbar transparent
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Switch size='medium' checked={appBarBlur} onChange={e => handleChange('appBarBlur', e.target.checked)} />
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              Appbar position
            </Typography>
            <Typography variant='body2' fontSize={13}>
              Customize your Appbar position
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <RadioGroup
              row
              value={appBar}
              sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              onChange={e => handleChange('appBar', e.target.value)}
            >
              <FormControlLabel value='fixed' label='Fixed' control={<Radio />} />
              <FormControlLabel value='static' label='Static' control={<Radio />} />
              {layout === 'horizontal' ? null : <FormControlLabel value='hidden' label='Hidden' control={<Radio />} />}
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Typography variant='h6' fontWeight={600} mb={0.5}>
              Sidebar Layout
            </Typography>
            <Typography variant='body2' fontSize={13}>
              Customize your sidebar layout
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <RadioGroup
              row
              value={layout}
              sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              onChange={e => {
                saveSettings({
                  ...settings,
                  layout: e.target.value,
                  lastLayout: e.target.value
                })
              }}
            >
              <FormControlLabel value='vertical' label='Vertical' control={<Radio />} />
              <FormControlLabel value='horizontal' label='Horizontal' control={<Radio />} />
            </RadioGroup>
          </Grid>
        </Grid>
      </CustomizerSpacing>
    </div>
  )
}

export default Overview
