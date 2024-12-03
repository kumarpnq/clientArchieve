import React, { Fragment, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  LinearProgress,
  linearProgressClasses,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import BarChart from 'src/components/charts/BarChart'

import StackChart from 'src/components/charts/StackChart'
import data from 'src/data/data.json'
import DoughnutChart from 'src/components/charts/DoughnutChart'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import MixedChart from 'src/components/charts/MixedChart'
import LineChart from 'src/components/charts/LineChart'
import MultiLabelBarChart from 'src/components/charts/MultiLabelBarChart'
import Search from 'src/components/search'
import words from 'src/data/word.json'

import useMenu from 'src/hooks/useMenu'
import Widget from './components/Widget'
import WordCloud from 'src/components/charts/WordCloud'
import { getComparativeChart, useGetComparativeChart } from 'src/api/comparative-highlights/comparativeHighlights'
import Lottie from 'lottie-react'
import loader from 'public/loader.json'

const bgColor = ['#fc8166', '#fbd059', '#58d8ff', '#5d87fd', '#57c0bd', '#8acd82', '#2f839e']
const pieData = [42, 11, 4, 8, 8, 9, 10, 8]

const ComparativeKeyHighlights = () => {
  const { companies, tonality, publications, journalist, mainlines, businessDailies, table } = data
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const [collapse, setCollapse] = useState({ table1: false, table2: false, table3: false, table4: false })
  const toggleCollapse = name => setCollapse(prev => ({ ...prev, [name]: !prev[name] }))
  const comparative = useGetComparativeChart()

  return (
    <Box sx={{ '& .MuiPaper-root.MuiCard-root': { borderRadius: 2 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={9}>
          <Grid container spacing={4}>
            <Grid item lg={6} xs={12}>
              {comparative ? (
                <Widget
                  title='Comparative Key Highlights'
                  openMenu={openMenu}
                  charts={{
                    bar: { component: MixedChart, props: { data: comparative } }
                  }}
                  table={
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {[
                              { title: 'Company', width: 130, align: 'left' },
                              { title: 'Volume', width: 100, align: 'center' },
                              { title: 'Volume SOV', width: 100, align: 'center' },
                              { title: 'Visibility', width: 100, align: 'center' },
                              { title: 'Visibility SOV', width: 100, align: 'center' }
                            ].map(col => (
                              <TableCell key={col.title} style={{ minWidth: col.width }} align={col.align}>
                                {col.title}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {companies.labels.map((label, i) => (
                            <TableRow key={label} hover sx={{ cursor: 'pointer' }}>
                              <TableCell component='th' scope='row'>
                                {label}
                              </TableCell>

                              <TableCell component='th' scope='row' align='center'>
                                <Typography variant='caption'>{companies.data.Visbility[i]}</Typography>
                              </TableCell>
                              <TableCell component='th' scope='row' align='center'>
                                <Typography variant='caption'>{companies.data.Image[i]}</Typography>
                              </TableCell>
                              <TableCell component='th' scope='row' align='center'>
                                <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                              </TableCell>
                              <TableCell component='th' scope='row' align='center'>
                                <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  }
                />
              ) : (
                <Card
                  elevation={0}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    resize: 'both',
                    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                    height: '100%'
                  }}
                >
                  <Stack direction='row' justifyContent='space-between' alignItems='center' mb={1}>
                    <Typography
                      variant='subtitle1'
                      fontWeight={500}
                      sx={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '1'
                      }}
                    >
                      <Skeleton width={200} />
                    </Typography>

                    <Stack direction='row' alignItems='center' spacing={1}>
                      <Skeleton variant='rounded' height={25} width={28} />
                      <Skeleton variant='rounded' height={25} width={120} />
                      <Skeleton variant='rounded' height={25} width={28} />
                    </Stack>
                  </Stack>
                  <Stack alignItems='center' justifyContent='center' flexGrow={1} width='100%'>
                    <Box width={200}>
                      <Lottie animationData={loader} />
                    </Box>
                  </Stack>
                </Card>
              )}
            </Grid>
            <Grid item lg={6} xs={12}>
              <Widget
                title='  Tonality Distribution: Industry - Print'
                openMenu={openMenu}
                charts={{
                  stacked: { component: StackChart, props: { data: tonality.data1.print, barPercentage: 0.2 } }
                }}
                table={
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {[
                            { title: 'Company', width: 130, align: 'left' },
                            { title: 'Volume', width: 100, align: 'center' },
                            { title: 'Volume SOV', width: 100, align: 'center' },
                            { title: 'Visibility', width: 100, align: 'center' },
                            { title: 'Visibility SOV', width: 100, align: 'center' }
                          ].map(col => (
                            <TableCell key={col.title} style={{ minWidth: col.width }} align={col.align}>
                              {col.title}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {companies.labels.map((label, i) => (
                          <TableRow
                            key={label}
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0
                              }
                            }}
                          >
                            <TableCell component='th' scope='row'>
                              {label}
                            </TableCell>

                            <TableCell component='th' scope='row' align='center'>
                              <Typography variant='caption'>{companies.data.Visbility[i]}</Typography>
                            </TableCell>
                            <TableCell component='th' scope='row' align='center'>
                              <Typography variant='caption'>{companies.data.Image[i]}</Typography>
                            </TableCell>
                            <TableCell component='th' scope='row' align='center'>
                              <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                            </TableCell>
                            <TableCell component='th' scope='row' align='center'>
                              <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Widget
                height={350}
                title='Colgate-Palmolive vs. Peers – Tonality Break-up'
                openMenu={openMenu}
                charts={{
                  bar: { component: BarChart, props: { data: tonality.data2.online, barPercentage: 0.3 } },
                  line: { component: LineChart, props: { data: tonality.data2.online } },
                  stacked: { component: StackChart, props: { data: tonality.data2.print, barPercentage: 0.1 } }
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card elevation={0} sx={{ height: '100%', p: 4 }}>
            <Typography
              variant='subtitle1'
              fontWeight={500}
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Tonality Break-up
            </Typography>
            <Box sx={{ height: { xs: 250, md: 300 }, overflow: 'auto' }}>
              <DoughnutChart
                labels={['COL-PAL', 'DABUR', 'ORAL-B', 'PATANJALI', 'PEPSODENT', 'SENSODYNE', 'CLOSE-UP', 'PERFORA']}
                data={pieData}
                cutout={120}
                radius={135}
              />
            </Box>

            <Box mt={4}>
              {['Col-Pal', 'Dabur', 'Oral-B', 'Patanjali', 'Pepsodent', 'Sensodyne', 'Close-UP', 'Performa'].map(
                (label, i) => (
                  <Box key={label}>
                    <Typography variant='subtitle2' color='text.secondary' textTransform='capitalize' gutterBottom>
                      {label}
                    </Typography>

                    <Grid container spacing={4} mb={1} alignItems='center'>
                      <Grid item xs={10}>
                        <LinearProgress
                          variant='determinate'
                          value={pieData[i]}
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
                          {pieData[i] + '%'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={4} mt={4}>
        <Grid item md={6} xs={12}>
          <Widget
            title='Industry Visibility in Mainlines – Print'
            openMenu={openMenu}
            charts={{
              bar: { component: BarChart, props: { data: publications.data1.print, barPercentage: 0.3 } },
              line: { component: LineChart, props: { data: publications.data1.print } },
              stacked: { component: StackChart, props: { data: publications.data1.print, barPercentage: 0.15 } }
            }}
            table={
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        { title: 'Company', width: 130, align: 'left' },
                        { title: 'Volume', width: 100, align: 'center' },
                        { title: 'Volume SOV', width: 100, align: 'center' },
                        { title: 'Visibility', width: 100, align: 'center' },
                        { title: 'Visibility SOV', width: 100, align: 'center' }
                      ].map(col => (
                        <TableCell key={col.title} style={{ minWidth: col.width }} align={col.align}>
                          {col.title}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.labels.map((label, i) => (
                      <TableRow
                        key={label}
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {label}
                        </TableCell>

                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data.Visbility[i]}</Typography>
                        </TableCell>
                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data.Image[i]}</Typography>
                        </TableCell>
                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                        </TableCell>
                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Widget
            title='Industry Visibility in Business Dailies – Print'
            openMenu={openMenu}
            charts={{
              bar: { component: BarChart, props: { data: publications.data2.print, barPercentage: 0.3 } },
              line: { component: LineChart, props: { data: publications.data2.print } },
              stacked: { component: StackChart, props: { data: publications.data2.print, barPercentage: 0.15 } }
            }}
            table={
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        { title: 'Company', width: 130, align: 'left' },
                        { title: 'Volume', width: 100, align: 'center' },
                        { title: 'Volume SOV', width: 100, align: 'center' },
                        { title: 'Visibility', width: 100, align: 'center' },
                        { title: 'Visibility SOV', width: 100, align: 'center' }
                      ].map(col => (
                        <TableCell key={col.title} style={{ minWidth: col.width }} align={col.align}>
                          {col.title}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.labels.map((label, i) => (
                      <TableRow
                        key={label}
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {label}
                        </TableCell>

                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data.Visbility[i]}</Typography>
                        </TableCell>
                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data.Image[i]}</Typography>
                        </TableCell>
                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                        </TableCell>
                        <TableCell component='th' scope='row' align='center'>
                          <Typography variant='caption'>{companies.data2.QE[i]}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            }
          />
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ mt: 4, p: 4, resize: 'both' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Stack>
            <Typography
              variant='h6'
              fontWeight={500}
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Comparative Key Highlights
            </Typography>
            <Typography
              variant='caption'
              color='text.tertiary'
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Keep track of companies and their reputation
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Search placeholder='Search' />
            <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
              Filters
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />
        <TableContainer>
          <Table sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  OVERALL
                </TableCell>
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  PRINT
                </TableCell>
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  ONLINE
                </TableCell>
              </TableRow>
              <TableRow>
                {table.table1.columns.map((col, i) => (
                  <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{ transition: 'all ease-in 6s' }}>
              {table.table1.companies.slice(0, 5).map(company => (
                <TableRow
                  key={company}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {company}
                  </TableCell>

                  {table.table1.visibility.map((v, i) => (
                    <TableCell component='th' scope='row' key={i} align='center'>
                      <Typography variant='caption'>{v}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {collapse.table1 &&
                table.table1.companies.slice(5).map(company => (
                  <TableRow
                    key={company}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {company}
                    </TableCell>

                    {table.table1.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Button variant='text' fullWidth onClick={() => toggleCollapse('table1')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.table1 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </TableContainer>
      </Card>
      <Card elevation={0} sx={{ mt: 4, p: 4, resize: 'both' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Stack>
            <Typography
              variant='h6'
              fontWeight={500}
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Publication Performance
            </Typography>
            <Typography
              variant='caption'
              color='text.tertiary'
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Keep track of companies and their reputation
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Search placeholder='Search' />
            <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
              Filters
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  MONEYCONTROL.COM
                </TableCell>
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  TIMESOFINDIA.COM
                </TableCell>
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  ECONOMICTIMES.COM
                </TableCell>
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  HINDUSTANTIMES.COM
                </TableCell>
                <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  REDIFF.COM
                </TableCell>
              </TableRow>
              <TableRow>
                {table.table2.columns.map((col, i) => (
                  <TableCell key={i} style={{ minWidth: i === 0 ? 150 : 100 }} align={i === 0 ? 'left' : 'center'}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table.table2.companies.slice(0, 5).map(company => (
                <TableRow
                  key={company}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {company}
                  </TableCell>

                  {table.table2.visibility.map((v, i) => (
                    <TableCell component='th' scope='row' key={i} align='center'>
                      <Typography variant='caption'>{v}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {collapse.table2 &&
                table.table2.companies.slice(5).map(company => (
                  <TableRow
                    key={company}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {company}
                    </TableCell>

                    {table.table2.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant='text' fullWidth sx={{ mt: 1 }} onClick={() => toggleCollapse('table2')}>
          <Typography variant='subtitle1' color='primary.main'>
            {collapse.table2 ? 'Show less' : 'Show more'}
          </Typography>
        </Button>
      </Card>
      <Card elevation={0} sx={{ mt: 4, p: 4, resize: 'both' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Stack>
            <Typography
              variant='h6'
              fontWeight={500}
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Journalist / Influencer Performance
            </Typography>
            <Typography
              variant='caption'
              color='text.tertiary'
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Keep track of companies and their reputation
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Search placeholder='Search' />
            <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
              Filters
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />
        <TableContainer
          sx={{
            borderRadius: '8px'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell colSpan={3} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  Sunil Shankar Matkar (moneycontrol.com)
                </TableCell>
                <TableCell colSpan={3} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  Vijay Kumar Yadav (indianexpress.com)
                </TableCell>
                <TableCell colSpan={3} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  Rajesa Bharati (navbharattimes.com)
                </TableCell>
                <TableCell colSpan={3} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  Aathira Varier, Subrata Panda (rediff.com)
                </TableCell>
                <TableCell colSpan={3} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                  Bavita Jha (zeenews.india.com)
                </TableCell>
              </TableRow>
              <TableRow>
                {table.table3.columns.map((col, i) => (
                  <TableCell key={i} style={{ minWidth: i === 0 ? 140 : 100 }} align={i === 0 ? 'left' : 'center'}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table.table3.companies.slice(0, 5).map(company => (
                <TableRow
                  key={company}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {company}
                  </TableCell>

                  {table.table3.visibility.map((v, i) => (
                    <TableCell component='th' scope='row' key={i} align='center'>
                      <Typography variant='caption'>{v}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {collapse.table3 &&
                table.table3.companies.slice(5).map(company => (
                  <TableRow
                    key={company}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {company}
                    </TableCell>

                    {table.table3.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant='text' fullWidth sx={{ mt: 1 }} onClick={() => toggleCollapse('table3')}>
          <Typography variant='subtitle1' color='primary.main'>
            {collapse.table3 ? 'Show less' : 'Show more'}
          </Typography>
        </Button>
      </Card>
      {/* <Card elevation={0} sx={{ mt: 4, p: 4, resize: 'both' }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
                    <Stack>
                        <Typography
                            variant='h6'
                            fontWeight={500}
                            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}>
                            Publication Performance
                        </Typography>
                        <Typography
                            variant='caption'
                            color='text.tertiary'
                            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}>
                            Keep track of companies and their reputation
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1.5}>
                        <Search placeholder='Search' />
                        <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                            Filters
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 4 }} />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 500, letterSpacing: 2 }}>PUBLICATION</TableCell>
                                {[
                                    'COLGATE PALMOLIVE',
                                    'DABUR INDIA',
                                    'GODREJ',
                                    'HALEON',
                                    'HUL',
                                    'ITC',
                                    'MARICO',
                                    'NESTLE',
                                    'PATANJALI',
                                    'PERFORA',
                                    'P&G',
                                    'TATA',
                                ].map(col => (
                                    <TableCell colSpan={2} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ minWidth: 100 }} />

                                {Array(12)
                                    .fill(0)
                                    .map((col, i) => (
                                        <Fragment key={i}>
                                            <TableCell style={{ minWidth: 50 }}>VS</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>QE</TableCell>
                                        </Fragment>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {table.table4.companies.map(company => (
                                <TableRow
                                    key={company}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}>
                                    <TableCell component='th' scope='row'>
                                        {company}
                                    </TableCell>

                                    {table.table4.visibility.map((v, i) => (
                                        <TableCell component='th' scope='row' key={i}>
                                            <Typography variant='caption'>{v}</Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card> */}
      {/* <Card elevation={0} sx={{ mt: 4, p: 4, resize: 'both' }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
                    <Stack>
                        <Typography
                            variant='h6'
                            fontWeight={500}
                            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}>
                            Journalist / Influencer Performance
                        </Typography>
                        <Typography
                            variant='caption'
                            color='text.tertiary'
                            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}>
                            Keep track of companies and their reputation
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1.5}>
                        <Search placeholder='Search' />
                        <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                            Filters
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 4 }} />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 500, letterSpacing: 2 }}>JOURNALIST</TableCell>
                                {[
                                    'COLGATE PALMOLIVE',
                                    'DABUR INDIA',
                                    'GODREJ',
                                    'HALEON',
                                    'HUL',
                                    'ITC',
                                    'MARICO',
                                    'NESTLE',
                                    'PATANJALI',
                                    'PERFORA',
                                    'P&G',
                                    'TATA',
                                ].map(col => (
                                    <TableCell colSpan={2} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ minWidth: 100 }} />

                                {Array(12)
                                    .fill(0)
                                    .map((col, i) => (
                                        <Fragment key={i}>
                                            <TableCell style={{ minWidth: 50 }}>VS</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>QE</TableCell>
                                        </Fragment>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {table.table5.companies.map(company => (
                                <TableRow
                                    key={company}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}>
                                    <TableCell component='th' scope='row'>
                                        {company}
                                    </TableCell>

                                    {table.table5.visibility.map((v, i) => (
                                        <TableCell component='th' scope='row' key={i}>
                                            <Typography variant='caption'>{v}</Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card> */}

      <Card elevation={0} sx={{ mt: 4, p: 4, resize: 'both' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Stack>
            <Typography
              variant='h6'
              fontWeight={500}
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Media Type Performance
            </Typography>
            <Typography
              variant='caption'
              color='text.tertiary'
              sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
            >
              Keep track of companies and their reputation
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Search placeholder='Search' />
            <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
              Filters
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 500, letterSpacing: 2 }}>MEDIA TYPE</TableCell>
                {['BUSINESS DAILIES', 'NATIONAL DAILIES', 'REGIONAL DAILIES', 'MAGAZINES'].map(col => (
                  <TableCell colSpan={2} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell style={{ minWidth: 140 }}>Company</TableCell>

                {Array(4)
                  .fill(0)
                  .map((col, i) => (
                    <Fragment key={i}>
                      <TableCell style={{ minWidth: 100 }} align='center'>
                        Volume SOV
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }} align='center'>
                        Visbility SOV
                      </TableCell>
                    </Fragment>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table.table6.companies.slice(0, 5).map(company => (
                <TableRow
                  key={company}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {company}
                  </TableCell>

                  {table.table6.visibility.map((v, i) => (
                    <TableCell component='th' scope='row' key={i} align='center'>
                      <Typography variant='caption'>{v}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {collapse.table4 &&
                table.table6.companies.slice(5).map(company => (
                  <TableRow
                    key={company}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {company}
                    </TableCell>

                    {table.table6.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant='text' fullWidth sx={{ mt: 1 }} onClick={() => toggleCollapse('table4')}>
          <Typography variant='subtitle1' color='primary.main'>
            {collapse.table4 ? 'Show less' : 'Show more'}
          </Typography>
        </Button>
      </Card>

      <Card elevation={0} sx={{ mt: 4, p: 4 }}>
        <WordCloud data={words.words} />
      </Card>
      <Card elevation={0} sx={{ mt: 4, p: 4, height: { xs: 350, md: 400, lg: 500 }, resize: 'both' }}>
        <BarChart data={mainlines.data1.print} barPercentage={0.3} />
      </Card>
      <Card elevation={0} sx={{ mt: 4, p: 4, height: { xs: 350, md: 400, lg: 500 }, resize: 'both' }}>
        <BarChart data={businessDailies.data1.print} barPercentage={0.3} />
      </Card>
      <Card elevation={0} sx={{ mt: 4, p: 4, height: { xs: 450, md: 500, lg: 700 }, resize: 'both' }}>
        <MultiLabelBarChart data={businessDailies.data1.print} barPercentage={0.3} />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        disableScrollLock
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 300px)',
            p: 0.5,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <FileDownloadOutlinedIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DashboardCustomizeOutlinedIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Customization</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ComparativeKeyHighlights
