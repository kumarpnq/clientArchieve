import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import Lottie from 'lottie-react'
import loader from 'public/loader.json'

export default function Loading({ width }) {
  return (
    <Stack alignItems='center' justifyContent='center' flexGrow={1} width='100%' height='100%'>
      <Box width={width || 200}>
        <Lottie animationData={loader} />
      </Box>
    </Stack>
  )
}
