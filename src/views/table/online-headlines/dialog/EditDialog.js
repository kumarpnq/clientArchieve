// EditDialog.js
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

// ** third party imports
import Iframe from 'react-iframe'
import MainStepper from './editStepper/MainStepper'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const EditDialog = ({ open, handleClose, socialFeed, fetchTagsFlag, setFetchTagsFlag }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='3xl' fullWidth>
      <DialogTitle color='primary'>Edit Social Feed</DialogTitle>
      <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 2, top: 2 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <MainStepper socialFeed={socialFeed} fetchTagsFlag={fetchTagsFlag} setFetchTagsFlag={setFetchTagsFlag} />

        <Iframe
          url={socialFeed?.socialFeedlink || ''}
          width='100%'
          height='500px'
          id='myId'
          className='myClassname'
          display='initial'
          position='relative'
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog
