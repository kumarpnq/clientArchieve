import { Box, Container, Link, Paper, Typography } from '@mui/material'
import React from 'react'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Image from 'next/image'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

function BadgeAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Badge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={<SmallAvatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />}
      >
        <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
      </Badge>
    </Stack>
  )
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 20,
  height: 20,
  border: `2px solid ${theme.palette.background.paper}`
}))

const Card = () => {
  return (
    <Box component={Paper} width={'100%'} height={130} py={2} px={2} my={1}>
      <Container sx={{ display: 'flex', gap: 2 }}>
        <BadgeAvatars />
        <Typography component={'div'} display={'flex'} alignItems={'center'} gap={1}>
          <Link>TrakinTech</Link>
          <Link>@TrakinTech</Link>
          <span>shared an image</span>
        </Typography>
      </Container>
      <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
        {/* image */}
        <Box
          sx={{
            width: 80,
            height: 65,
            border: '1px solid lightgray',
            borderRadius: '3px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            fontSize: '0.5em',
            textAlign: 'center',
            transition: 'transform 0.3s ease-in-out', // Slow zoom-in effect
            '&:hover': {
              transform: 'scale(1.1)' // Slight zoom-in on hover
            }
          }}
          alt='thumbnail'
        >
          thumbnail
        </Box>
        <Typography variant='subtitle1'>vivo T3 Unboxing & First Impressions ⚡</Typography>
      </Box>
    </Box>
  )
}

const DataCard = () => {
  return (
    <Box display={'flex'} gap={4} width={'100%'}>
      <Box width={'100%'}>
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i}></Card>
        ))}
      </Box>
      <Box width={'100%'}>
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i}></Card>
        ))}
      </Box>
    </Box>
  )
}

export default DataCard
