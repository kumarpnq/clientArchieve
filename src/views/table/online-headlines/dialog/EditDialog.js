// EditDialog.js
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

// ** third party imports
import Iframe from 'react-iframe'
import MainStepper from './editStepper/MainStepper'

const EditDialog = ({ open, handleClose, socialFeed, fetchTagsFlag, setFetchTagsFlag }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle color='primary'>Edit Social Feed</DialogTitle>
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
