import { Box, Card, Grid, LinearProgress, linearProgressClasses, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import DoughnutChart from 'src/components/charts/DoughnutChart'
import { Tab, Tabs } from 'src/components/Tabs'
import { Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'

const bgColor = ['#fc8166', '#fbd059', '#58d8ff', '#5d87fd', '#57c0bd', '#8acd82', '#2f839e']
const pieData = [42, 11, 4, 8, 8, 9, 10, 8]

function ComparativePie() {
  const [tabSelected, setTabSelected] = useState('V_Score')
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const { data, loading } = useChartAndGraphApi(VISIBILITY_IMAGE_SCORE, Print, startDate, endDate)

  const onChangeTab = (e, newValue) => {
    setTabSelected(newValue)
  }

  return (
    <Card elevation={0} sx={{ height: '100%', p: 4 }}>
      <Typography
        variant='subtitle1'
        fontWeight={500}
        mb={2}
        sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
      >
        Share of voice
      </Typography>

      <Tabs
        value={tabSelected}
        onChange={onChangeTab}
        className='cancelSelection'
        sx={{
          mt: 0,
          mb: 2,

          '& .MuiTab-root': {
            m: 0,
            mr: 6,
            minWidth: 50,
            fontSize: 13
          }
        }}
      >
        <Tab label={'Visibility'} value={'V_Score'} />
        <Tab label={'Volume'} value={'doc_count'} />
      </Tabs>
      <Box sx={{ height: { xs: 250, md: 300 }, overflow: 'auto' }}>
        <DoughnutChart
          labels={['COL-PAL', 'DABUR', 'ORAL-B', 'PATANJALI', 'PEPSODENT', 'SENSODYNE', 'CLOSE-UP', 'PERFORA']}
          data={pieData}
          cutout={120}
          radius={135}
        />
      </Box>

      <Box mt={4}>
        {data?.map((company, i) => {
          const value = Math.trunc(tabSelected === 'V_Score' ? company[tabSelected].value : company.doc_count)

          return (
            <Box key={company.key}>
              <Typography variant='subtitle2' color='text.secondary' textTransform='capitalize' gutterBottom>
                {company.key}
              </Typography>

              <Grid container spacing={4} mb={1} alignItems='center'>
                <Grid item xs={10}>
                  <LinearProgress
                    variant='determinate'
                    value={value}
                    sx={{
                      height: 10,
                      borderRadius: '5px',
                      [`&.${linearProgressClasses.colorPrimary}`]: {
                        backgroundColor: '#f7f9fa'
                      },
                      [`& .${linearProgressClasses.bar}`]: {
                        borderRadius: '5px',
                        backgroundColor: bgColor[i]
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='body2' fontSize={13}>
                    {value}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
}

export default ComparativePie
