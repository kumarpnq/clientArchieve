import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import Box from '@mui/material/Box'
import Iframe from 'react-iframe'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function SocialFeedFullScreenDialog({ open, handleClose, socialFeed, formattedDate }) {
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          {/* Company Logo on the Left */}
          {/* <img
            src='https://www.perceptionandquant.com/logo2.png'
            alt='Company Logo'
            style={{ height: '20px', marginRight: '16px' }}
          /> */}
          <Typography variant='h6' color='inherit'>
            {socialFeed && socialFeed.article}
          </Typography>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'></Typography>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Bottom AppBar for Article Details */}
      <AppBar position='sticky' color='default'>
        <Toolbar>
          {/* Article Details */}
          <div style={{ flex: 1 }}>
            {/* <Typography variant='h6' color='inherit'>
              {article.article}
            </Typography> */}
            <Typography variant='subtitle1' color='inherit'>
              Headline: {socialFeed && socialFeed.headline}
            </Typography>
            <Typography variant='subtitle1' color='inherit'>
              Publisher: {socialFeed && socialFeed.publisher}
            </Typography>
            <Typography variant='subtitle1' color='inherit'>
              Summary: {socialFeed && socialFeed.summary}
            </Typography>
            <Typography variant='subtitle1' color='inherit'>
              Date: {socialFeed && formattedDate}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      {/* Toolbar with Article View Buttons */}
      <Toolbar>
        <Button startIcon={<VisibilityIcon />} variant='outlined' sx={{ marginRight: 2 }}>
          Article View
        </Button>
        <Button startIcon={<TextFieldsIcon />} variant='outlined'>
          Text
        </Button>
      </Toolbar>
      <Box p={2}>
        <Iframe
          url={socialFeed?.socialFeedlink || ''}
          width='100%'
          height='500px'
          id='myId'
          className='myClassname'
          display='initial'
          position='relative'
        />
      </Box>
    </Dialog>
  )
}
