// PublicationLogo.js

import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import Card from '@mui/material/Card'
import { BASE_URL } from 'src/api/base'

const PublicationLogo = ({ articles }) => {
  const [logoInfo, setLogoInfo] = useState({
    leftLogo: '',
    mainLogo: '',
    rightLogo: '',
    copyrightText: ''
  })

  useEffect(() => {
    const fetchLogoInfo = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        if (storedToken) {
          const { clientId, publicationId } = articles // Assuming articles contain clientId and publicationId

          const response = await axios.get(`${BASE_URL}/clientDisplayDetails/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: { clientId, publicationId }
          })

          if (response.data && response.data.clientDetails) {
            const { clientLogoFile, clientLogoRightFile, publicationLogoFile, publicationCopyright } =
              response.data.clientDetails

            setLogoInfo({
              leftLogo: `data:image/png;base64,${clientLogoFile}`,
              mainLogo: `data:image/png;base64,${publicationLogoFile}`,
              rightLogo: `data:image/png;base64,${clientLogoRightFile}`,
              copyrightText: publicationCopyright
            })
          }
        }
      } catch (error) {
        console.error('Error fetching logo details:', error)
      }
    }

    fetchLogoInfo()
  }, [articles])

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {/* Logo on the left */}
        {logoInfo.leftLogo && (
          <img
            src={logoInfo.leftLogo}
            alt='Left Logo'
            style={{ width: '55px', height: '45px', marginRight: '388px', border: '1px solid #000' }}
          />
        )}

        {/* Main publication logo in the middle */}
        {logoInfo.mainLogo && (
          <img
            src={logoInfo.mainLogo}
            alt='Publication Logo'
            style={{ width: '250px', height: '80px', border: '1px solid #000' }}
          />
        )}

        {/* Logo on the right */}
        {logoInfo.rightLogo && (
          <img
            src={logoInfo.rightLogo}
            alt='Right Logo'
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
