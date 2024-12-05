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
import Searchbox from 'src/components/Searchbox'
import words from 'src/data/word.json'

import useMenu from 'src/hooks/useMenu'
import Widget from './components/Widget'
import WordCloud from 'src/components/charts/WordCloud'
import { useGetComparativeChart } from 'src/api/comparative-highlights/comparativeHighlights'
import Lottie from 'lottie-react'
import loader from 'public/loader.json'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useLocalStorage } from '@mantine/hooks'
import { Tab, TabPanel, Tabs } from 'src/components/Tabs'
import defaultLayouts from './layout'

const bgColor = ['#fc8166', '#fbd059', '#58d8ff', '#5d87fd', '#57c0bd', '#8acd82', '#2f839e']
const pieData = [42, 11, 4, 8, 8, 9, 10, 8]

// Breakpoints and column definitions
const breakpoints = { lg: 1256, md: 1024, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 16, md: 16, sm: 16, xs: 16, xxs: 16 }
const ReactGridLayout = WidthProvider(Responsive)

const Page = () => {
  const { companies, tonality, publications, journalist, mainlines, businessDailies, table } = data
  const { anchorEl, openMenu, closeMenu } = useMenu()

  const [collapse, setCollapse] = useState({
    t1: false,
    t2: false,
    t3: false,
    t4: false,
    t5: false,
    t6: false,
    t7: false,
    t8: false,
    t9: false,
    t10: false,
    t11: false,
    t12: false,
    t13: false
  })
  const toggleCollapse = name => setCollapse(prev => ({ ...prev, [name]: !prev[name] }))
  const { data: comparative, loading: comparativeLoading } = useGetComparativeChart()

  const [layouts, setLayouts] = useLocalStorage({
    key: 'comparative',
    defaultValue: defaultLayouts,
    getInitialValueInEffect: false
  })

  // const [layouts, setLayouts] = useState(defaultLayouts)

  const [tabSelected, setTabSelected] = useState(0)

  const handleChange = (event, newValue) => {
    setTabSelected(newValue)
  }

  // const [currentLayout, setCurrentLayout] = useState([])

  const onLayoutChange = (curr, all) => {
    if (layouts === defaultLayouts) return
    setLayouts(all)
  }

  return (
    <Box sx={{ '& .MuiPaper-root.MuiCard-root': { borderRadius: 2 } }}>
      <ReactGridLayout
        className='layout'
        margin={[16, 16]}
        layouts={layouts}
        containerPadding={0}
        rowHeight={1}
        useCSSTransforms={true}
        draggableCancel='.cancelSelection'
        breakpoints={breakpoints}
        onLayoutChange={onLayoutChange}
        cols={cols}
      >
        <Box key='0'>
          {comparative ? (
            <Widget
              title='Comparative Key Highlights'
              openMenu={openMenu}
              loading={comparativeLoading}
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
                height: '100%',
                overflow: 'auto'
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
        </Box>
        <Box key='1'>
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
        </Box>

        <Box key='2'>
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
        </Box>
        <Box key='3'>
          <Widget
            height={320}
            title='Colgate-Palmolive vs. Peers – Tonality Break-up'
            openMenu={openMenu}
            charts={{
              bar: { component: BarChart, props: { data: tonality.data2.online, barPercentage: 0.3 } },
              line: { component: LineChart, props: { data: tonality.data2.online } },
              stacked: { component: StackChart, props: { data: tonality.data2.print, barPercentage: 0.1 } }
            }}
          />
        </Box>

        <Box key='4'>
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
        </Box>
        <Box key='5'>
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
        </Box>

        <Card elevation={0} sx={{ p: 4 }} key='6'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Comparative Key Highlights
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
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

                  {collapse.t1 &&
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
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
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

                  {collapse.t1 &&
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
            </TableContainer>
          </TabPanel>
          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t1')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t1 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='7'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Publication Performance I
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader>
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
                  {collapse.t2 &&
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
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer style={{ height: 420 }}>
              <Table stickyHeader>
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
                  {collapse.t2 &&
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
          </TabPanel>
          <Button
            variant='text'
            className='cancelSelection'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => toggleCollapse('t2')}
          >
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t2 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='8'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Publication Performance II
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader>
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
                      'TATA'
                    ].map(col => (
                      <TableCell
                        colSpan={2}
                        align='center'
                        sx={{ fontWeight: 500, letterSpacing: 2, minWidth: 250 }}
                        key={col}
                      >
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
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            VS
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            QE
                          </TableCell>
                        </Fragment>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.table4.companies.slice(0, 5).map(company => (
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

                      {table.table4.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {collapse.t3 &&
                    table.table4.companies.slice(5).map(company => (
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

                        {table.table4.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader>
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
                      'TATA'
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
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            VS
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            QE
                          </TableCell>
                        </Fragment>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.table4.companies.slice(0, 5).map(company => (
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

                      {table.table4.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {collapse.t3 &&
                    table.table4.companies.slice(5).map(company => (
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

                        {table.table4.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t3')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t3 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='9'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Journalist / Influencer Performance I
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>

          <TabPanel value={tabSelected} index={0}>
            <TableContainer
              sx={{
                borderRadius: '8px',
                height: 380
              }}
            >
              <Table stickyHeader>
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
                  {table.table3.companies.slice(0, 4).map(company => (
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
                  {collapse.t4 &&
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
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer
              sx={{
                borderRadius: '8px',
                height: 380
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
                  {table.table3.companies.slice(0, 4).map(company => (
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
                  {collapse.t4 &&
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
          </TabPanel>
          <Button
            variant='text'
            className='cancelSelection'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => toggleCollapse('t4')}
          >
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t4 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='10'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Journalist / Influencer Performance II
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader>
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
                      'TATA'
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
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            VS
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            QE
                          </TableCell>
                        </Fragment>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.table5.companies.slice(0, 5).map(company => (
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

                      {table.table5.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {collapse.t5 &&
                    table.table5.companies.slice(5).map(company => (
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

                        {table.table5.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader>
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
                      'TATA'
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
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            VS
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            QE
                          </TableCell>
                        </Fragment>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collapse.t5 &&
                    table.table5.companies.slice(5).map(company => (
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

                        {table.table5.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {table.table5.companies.slice(0, 5).map(company => (
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

                      {table.table5.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <Button
            variant='text'
            className='cancelSelection'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => toggleCollapse('t5')}
          >
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t5 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='11'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Media Type Performance
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />
          <TableContainer style={{ height: 420 }}>
            <Table stickyHeader>
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
                {table.table6.companies.slice(0, 6).map(company => (
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
                {collapse.t6 &&
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
          <Button
            variant='text'
            className='cancelSelection'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => toggleCollapse('t6')}
          >
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t6 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='12'>
          <WordCloud data={words.words} />
        </Card>

        <Card elevation={0} sx={{ p: 4, height: { xs: 350, md: 400, lg: 500 } }} key='13'>
          <BarChart data={mainlines.data1.print} barPercentage={0.3} />
        </Card>

        <Card elevation={0} sx={{ p: 4, height: { xs: 350, md: 400, lg: 500 } }} key='14'>
          <BarChart data={businessDailies.data1.print} barPercentage={0.3} />
        </Card>

        <Card elevation={0} sx={{ p: 4, height: { xs: 450, md: 500, lg: 700 } }} key='15'>
          <MultiLabelBarChart data={businessDailies.data1.print} barPercentage={0.3} />
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='16'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Genre / Theme Performance I
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: 2 }}>REPORTING THEME</TableCell>
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
                      'TATA'
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
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            VS
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            QE
                          </TableCell>
                        </Fragment>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.table5.companies.slice(0, 5).map(company => (
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

                      {table.table5.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {collapse.t7 &&
                    table.table5.companies.slice(5).map(company => (
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

                        {table.table5.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: 2 }}>REPORTING THEME</TableCell>
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
                      'TATA'
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
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            VS
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }} align='center'>
                            QE
                          </TableCell>
                        </Fragment>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collapse.t7 &&
                    table.table5.companies.slice(5).map(company => (
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

                        {table.table5.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {table.table5.companies.slice(0, 5).map(company => (
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

                      {table.table5.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <Button
            variant='text'
            className='cancelSelection'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => toggleCollapse('t7')}
          >
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t7 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='17'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Genre / Theme Performance II
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {['PRODUCT', 'HR', 'FINANCIAL', 'MARKETING', 'CSR & SUSTAINABILITY'].map(col => (
                      <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {table.table7.columns.map((col, i) => (
                      <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ transition: 'all ease-in 6s' }}>
                  {table.table7.companies.slice(0, 5).map(company => (
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

                      {table.table7.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {collapse.t8 &&
                    table.table7.companies.slice(5).map(company => (
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

                        {table.table7.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {['PRODUCT', 'HR', 'FINANCIAL', 'MARKETING', 'CSR & SUSTAINABILITY'].map(col => (
                      <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {table.table7.columns.map((col, i) => (
                      <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ transition: 'all ease-in 6s' }}>
                  {table.table7.companies.slice(0, 5).map(company => (
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

                      {table.table7.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {collapse.t8 &&
                    table.table7.companies.slice(5).map(company => (
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

                        {table.table7.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t8')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t8 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='18'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Geography Performance I
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />
          <TableContainer style={{ height: 420 }}>
            <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {['EAST', 'NORTH', 'SOUTH', 'WEST'].map(col => (
                    <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {table.table8.columns.map((col, i) => (
                    <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ transition: 'all ease-in 6s' }}>
                {table.table8.companies.slice(0, 6).map(company => (
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

                    {table.table8.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {collapse.t9 &&
                  table.table8.companies.slice(6).map(company => (
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

                      {table.table8.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t9')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t9 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='19'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Geography Performance II
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <TableContainer style={{ height: 420 }}>
            <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {['PUNE', 'AHMEDABAD', 'HYDERABAD', 'DELHI', 'MUMBAI'].map(col => (
                    <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {table.table7.columns.map((col, i) => (
                    <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ transition: 'all ease-in 6s' }}>
                {table.table7.companies.slice(0, 6).map(company => (
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

                    {table.table7.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {collapse.t10 &&
                  table.table7.companies.slice(6).map(company => (
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

                      {table.table7.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t10')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t10 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='20'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Prominence Type Presence
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' className='cancelSelection' spacing={1.5}>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>

          <TabPanel value={tabSelected} index={0}>
            <TableContainer
              sx={{
                borderRadius: '8px',
                height: 380
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {['BALCARDI', 'BEAM SUNTORY', 'DIAGEO', 'PERNOD RICARD', 'RADICO KHAITAN'].map(col => (
                      <TableCell colSpan={2} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {table.table9.columns.map((col, i) => (
                      <TableCell key={i} style={{ minWidth: i === 0 ? 140 : 100 }} align={i === 0 ? 'left' : 'center'}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.table9.companies.slice(0, 5).map(company => (
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

                      {table.table9.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {collapse.t11 &&
                    table.table9.companies.slice(5).map(company => (
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

                        {table.table9.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer
              sx={{
                borderRadius: '8px',
                height: 380
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {['BALCARDI', 'BEAM SUNTORY', 'DIAGEO', 'PERNOD RICARD', 'RADICO KHAITAN'].map(col => (
                      <TableCell colSpan={2} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {table.table9.columns.map((col, i) => (
                      <TableCell key={i} style={{ minWidth: i === 0 ? 140 : 100 }} align={i === 0 ? 'left' : 'center'}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.table9.companies.slice(0, 5).map(company => (
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

                      {table.table9.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {collapse.t11 &&
                    table.table9.companies.slice(5).map(company => (
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

                        {table.table9.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <Button
            variant='text'
            className='cancelSelection'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => toggleCollapse('t11')}
          >
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t11 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='21'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Article Size
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tabSelected} onChange={handleChange} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={'Print'} value={0} />
            <Tab label={'Online'} value={1} />
          </Tabs>

          <TabPanel value={tabSelected} index={0}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {['MAJOR FEATURE', 'LARGE', 'BIG', 'MEDIUM', 'SMALL', 'BRIEF'].map(col => (
                      <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {table.table10.columns.map((col, i) => (
                      <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ transition: 'all ease-in 6s' }}>
                  {table.table10.companies.slice(0, 5).map(company => (
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

                      {table.table10.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {collapse.t12 &&
                    table.table10.companies.slice(5).map(company => (
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

                        {table.table10.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <TableContainer style={{ height: 380 }}>
              <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {['MAJOR FEATURE', 'LARGE', 'BIG', 'MEDIUM', 'SMALL', 'BRIEF'].map(col => (
                      <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {table.table10.columns.map((col, i) => (
                      <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ transition: 'all ease-in 6s' }}>
                  {table.table10.companies.slice(0, 5).map(company => (
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

                      {table.table10.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {collapse.t12 &&
                    table.table10.companies.slice(5).map(company => (
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

                        {table.table10.visibility.map((v, i) => (
                          <TableCell component='th' scope='row' key={i} align='center'>
                            <Typography variant='caption'>{v}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t12')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t12 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='22'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Language
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />
          <TableContainer style={{ height: 420 }}>
            <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {['ENGLISH', 'HINDI', 'KANNADA', 'MARATHI'].map(col => (
                    <TableCell colSpan={4} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }} key={col}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {table.table8.columns.map((col, i) => (
                    <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ transition: 'all ease-in 6s' }}>
                {table.table8.companies.slice(0, 5).map(company => (
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

                    {table.table8.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {collapse.t13 &&
                  table.table8.companies.slice(5).map(company => (
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

                      {table.table8.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t13')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t13 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>

        <Card elevation={0} sx={{ p: 4 }} key='23'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography
                variant='h5'
                fontWeight={500}
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                KPI
              </Typography>
              <Typography
                variant='body2'
                color='text.tertiary'
                sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
              >
                Keep track of companies and their reputation
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
              <Searchbox placeholder='Search' />
              <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
                Filters
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ my: 4 }} />

          <TableContainer style={{ height: 420 }}>
            <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                    OVERALL
                  </TableCell>
                  <TableCell colSpan={6} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                    PRINT
                  </TableCell>
                  <TableCell colSpan={6} align='center' sx={{ fontWeight: 500, letterSpacing: 2 }}>
                    ONLINE
                  </TableCell>
                </TableRow>
                <TableRow>
                  {table.table11.columns.map((col, i) => (
                    <TableCell key={i} style={{ minWidth: i === 0 ? 130 : 100 }} align={i === 0 ? 'left' : 'center'}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ transition: 'all ease-in 6s' }}>
                {table.table11.companies.slice(0, 6).map(company => (
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

                    {table.table11.visibility.map((v, i) => (
                      <TableCell component='th' scope='row' key={i} align='center'>
                        <Typography variant='caption'>{v}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {collapse.t14 &&
                  table.table11.companies.slice(6).map(company => (
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

                      {table.table11.visibility.map((v, i) => (
                        <TableCell component='th' scope='row' key={i} align='center'>
                          <Typography variant='caption'>{v}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant='text' className='cancelSelection' fullWidth onClick={() => toggleCollapse('t14')}>
            <Typography variant='subtitle1' color='primary.main'>
              {collapse.t14 ? 'Show less' : 'Show more'}
            </Typography>
          </Button>
        </Card>
      </ReactGridLayout>

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

export default Page
