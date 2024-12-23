import React, { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Tab, TabPanel, Tabs } from 'src/components/tabs/Tabs'

import Appearance from './components/appearance'
import Accounts from './components/accounts'

const Pages = {
  accounts: Accounts,
  appearance: Appearance
}

export default function Settings() {
  const [page, setPage] = useState('accounts')
  const Page = useMemo(() => Pages[page], [page])

  const onPageChange = (e, newValue) => setPage(newValue)

  return (
    <Box>
      <Typography variant='h4' fontWeight={700} mb={4}>
        Settings
      </Typography>

      <Tabs
        value={page}
        onChange={onPageChange}
        className='cancelSelection'
        sx={{
          mt: 0,
          mb: 6,

          '& .MuiTab-root': {
            m: 0,
            mr: 6,
            minWidth: 50,
            fontSize: 13
          }
        }}
      >
        {Object.keys(Pages).map(page => (
          <Tab label={page} value={page} key={page} sx={{ textTransform: 'capitalize' }} />
        ))}
      </Tabs>
      <TabPanel>
        <Page />
      </TabPanel>
    </Box>
  )
}
