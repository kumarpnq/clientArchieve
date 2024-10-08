// PublicationLogo.js

import React, { useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Image from 'next/image'

const PublicationLogo = ({ articles }) => {
  const [logoInfo, setLogoInfo] = useState({
    leftLogo: 'data:image/png;base64,',
    mainLogo: 'data:image/png;base64,',
    rightLogo: 'data:image/png;base64,',
    copyrightText: 'data:image/png;base64,'
  })

  return (
    // <Card sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
    //   {/* Logo on the left */}
    //   <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo1' height={30} width={60} />
    //   <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo2' height={30} width={60} />
    //   <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo3' height={30} width={60} />

    //   {/* Copyright text
    //     <Typography variant='body2' color='textSecondary'>
    //       {logoInfo.copyrightText}
    //     </Typography> */}
    // </Card>

    <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 2 }}>
      <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo' height={15} width={150} />

      <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo' height={15} width={150} />

      <Image src={'https://perceptionandquant.com/logo2.png'} alt='logo' height={15} width={150} />
    </Card>
  )
}

export default PublicationLogo
