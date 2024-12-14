import { Box, Card, Grid, LinearProgress, linearProgressClasses, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import DoughnutChart from 'src/components/charts/DoughnutChart'
import { Tab, Tabs } from 'src/components/Tabs'
import { Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'

import Lottie from 'lottie-react'
import loader from 'public/loader.json'
import Loading from 'src/components/Loading'

const bgColor = ['#fc8166', '#fbd059', '#58d8ff', '#5d87fd', '#57c0bd', '#8acd82', '#2f839e']
const initialValues = { labels: [], V_Score: [], doc_count: [] }

function ComparativePie() {
  const [tabSelected, setTabSelected] = useState('V_Score')
  const [values, setValues] = useState({ labels: [], V_Score: [], doc_count: [] })

  const { data, loading } = useChartAndGraphApi({
    reportType: VISIBILITY_IMAGE_SCORE,
    mediaType: Print,
    path: 'data.doc.Report.CompanyTag.FilterCompany.Company.buckets'
  })

  const onChangeTab = (e, newValue) => {
    setTabSelected(newValue)
  }

  function calculatePercentage(value, total) {
    return Math.round((value / total) * 100)
  }

  useEffect(() => {
    if (!data) return
    const val = structuredClone(initialValues)

    const { totalVScore, totalDocCount } = data.reduce(
      (acc, d) => {
        acc.totalVScore += d.V_Score.value
        acc.totalDocCount += d.doc_count

        return acc
      },
      { totalVScore: 0, totalDocCount: 0 }
    )

    data.forEach(d => {
      val.labels.push(d.key)
      val.V_Score.push(calculatePercentage(d.V_Score.value, totalVScore))
      val.doc_count.push(calculatePercentage(d.doc_count, totalDocCount))
    })

    setValues(val)
  }, [data])

  return (
    <Card elevation={0} sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant='subtitle1'
        fontWeight={500}
        mb={2}
        sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
      >
        Share of voice
      </Typography>

      {loading ? (
        <Loading />
      ) : (
        <>
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

          {data && values.labels.length > 0 ? (
            <>
              <Box sx={{ height: 300, width: '100%', overflow: 'auto' }}>
                <DoughnutChart labels={values.labels} data={values[tabSelected]} cutout='80%' radius='85%' />
              </Box>

              <Box mt={4} flexGrow={1} sx={{ overflowY: 'auto' }}>
                {values.labels.map((company, i) => {
                  return (
                    <Box key={i}>
                      <Typography
                        variant='subtitle2'
                        color='text.secondary'
                        textTransform='capitalize'
                        gutterBottom
                        sx={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: '1'
                        }}
                      >
                        {company}
                      </Typography>

                      <Grid container spacing={4} mb={1} alignItems='center'>
                        <Grid item xs={10}>
                          <LinearProgress
                            variant='determinate'
                            value={values[tabSelected][i]}
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
                            {values[tabSelected][i]}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                })}
              </Box>
            </>
          ) : (
            <Typography variant='subtitle1'>No data available</Typography>
          )}
        </>
      )}
    </Card>
  )
}

export default ComparativePie
