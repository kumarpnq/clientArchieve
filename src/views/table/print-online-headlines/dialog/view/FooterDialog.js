// FooterDialog.js

import React from 'react'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'

const FooterDialog = () => {
  return (
    <DialogActions style={{ justifyContent: 'center' }}>
      <Typography variant='body2' color='textSecondary'>
        Copyright © 2024. All rights reserved By cirrus
      </Typography>
    </DialogActions>
  )
}

export default FooterDialog
