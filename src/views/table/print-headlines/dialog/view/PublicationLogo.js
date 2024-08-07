// PublicationLogo.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import { BASE_URL } from 'src/api/base'
import Image from 'next/image'

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
    <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
      <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo' height={15} width={150} />

      {/* <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo' height={20} width={150} /> */}

      <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo' height={15} width={150} />
    </Card>
  )
}

export default PublicationLogo
