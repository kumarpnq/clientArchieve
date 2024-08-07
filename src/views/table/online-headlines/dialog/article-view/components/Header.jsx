import { Box, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const formatDate = dateString => dayjs(dateString).format('DD-MMM-YYYY')

const Logo = () => (
  <Typography component='span'>
    <span style={{ color: 'black' }}>PERCEPTION</span>
    <span style={{ color: 'red' }}>&</span>
    <span style={{ color: 'gray' }}>QUANT</span>
  </Typography>
)

const Header = ({ article }) => {
  const details = [
    { label: 'News Date', value: formatDate(article?.feedDate) },
    { label: 'Media Type', value: 'Online' },
    { label: 'Publication', value: article?.publisher },
    { label: 'Language', value: 'English' },
    { label: 'Author', value: article?.socialFeedAuthorName },
    { label: 'Edition', value: 'Online Web' }
  ]

  return (
    <Box component={Paper}>
      <Box display='flex' justifyContent='space-between'>
        <Logo />
        <Logo />
      </Box>
      <Typography
        variant='h6'
        sx={{
          color: 'text.primary',
          bgcolor: 'primary.main',
          borderRadius: '2px',
          fontSize: '0.9em',
          py: 1
        }}
      >
        {article?.headline}
      </Typography>
      <Box mt={2} display='flex' alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'}>
        {details.map(({ label, value }, index) => (
          <Typography key={index} variant='subtitle2' color='primary.main'>
            {label} :{' '}
            <Typography component='span' fontSize='0.9em' color='text.primary'>
              {value}
            </Typography>
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default Header
