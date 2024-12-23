import { Box, Stack, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import Overview from './overview'
import Charts from './charts'

import { NavigationTabs, Tab, TabPanel } from 'src/components/tabs/NavigationTabs'

const Pages = {
  overview: Overview,
  charts: Charts
}

function Appearance() {
  const [page, setPage] = useState('overview')
  const Page = useMemo(() => Pages[page], [page])

  const onPageChange = (e, newValue) => setPage(newValue)

  return (
    <Stack>
      <Typography variant='h5' fontWeight={600} mb={0.5}>
        Appearance
      </Typography>
      <Typography variant='body2' mb={6}>
        Change how your dashboard looks and feel
      </Typography>

      <NavigationTabs value={page} onChange={onPageChange} className='cancelSelection'>
        {Object.keys(Pages).map(page => (
          <Tab label={page} value={page} key={page} sx={{ textTransform: 'capitalize' }} />
        ))}
      </NavigationTabs>
      <TabPanel sx={{ overflow: 'auto', flexGrow: 1 }}>
        <Page />
      </TabPanel>
    </Stack>
  )
}

export default Appearance
