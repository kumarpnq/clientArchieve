// ArticlePopover.js
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'

const ArticlePopover = ({ isOpen, anchorEl, handleClose, summary }) => (
  <Popover
    open={isOpen}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    onClose={handleClose}
    disableRestoreFocus
  >
    <Box sx={{ p: 1 }}>
      <Typography variant='caption'>{summary}</Typography>
    </Box>
  </Popover>
)

export default ArticlePopover
