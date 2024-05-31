// PublicationLogo.js

import React, { useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

const PublicationLogo = ({ articles }) => {
  const [logoInfo, setLogoInfo] = useState({
    leftLogo: 'data:image/png;base64,',
    mainLogo: 'data:image/png;base64,',
    rightLogo: 'data:image/png;base64,',
    copyrightText: 'data:image/png;base64,'
  })

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {/* Logo on the left */}
        {logoInfo.leftLogo && (
          <img
            src={logoInfo.leftLogo}
            alt='one'
            style={{ width: '55px', height: '45px', marginRight: '388px', border: '1px solid #000' }}
          />
        )}

        {/* Main publication logo in the middle */}
        {logoInfo.mainLogo && (
          <img src={logoInfo.mainLogo} alt='two' style={{ width: '250px', height: '80px', border: '1px solid #000' }} />
        )}

        {/* Logo on the right */}
        {logoInfo.rightLogo && (
          <img
            src={logoInfo.rightLogo}
            alt='three'
            style={{ width: '55px', height: '45px', marginLeft: '388px', border: '1px solid #000' }}
          />
        )}

        {/* Copyright text */}
        <Typography variant='body2' color='textSecondary'>
          {logoInfo.copyrightText}
        </Typography>
      </div>
    </Card>
  )
}

export default PublicationLogo
