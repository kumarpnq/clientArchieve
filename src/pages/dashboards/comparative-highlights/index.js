import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import dynamic from 'next/dynamic'

// *  React GRID Layout
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

// import { breakpoints, cols } from './layout'
import LazyLoad from 'src/components/loaders/LazyLoad'

// * Tables and Charts
const Comparative = dynamic(() => import('./components/comparative/ComparativeChart'))
const ComparativeTable = dynamic(() => import('./components/comparative/ComparativeTable'))
const ComparativePie = dynamic(() => import('./components/comparative/ComparativePie'))
const ComparativeDataGrid = dynamic(() => import('./components/comparative/ComparativeDataGrid'))
const MediaType = dynamic(() => import('./components/MediaType'))
const TopPublication = dynamic(() => import('./components/TopPublication'))
const RegionalPerformance = dynamic(() => import('./components/RegionalPerformance'))
const CityPerformance = dynamic(() => import('./components/CityPerformance'))
const ThemePerformance = dynamic(() => import('./components/ThemePerformance'))
const Prominence = dynamic(() => import('./components/Prominence'))
const JournalistTonality = dynamic(() => import('./components/JournalistTonality'))
const JournalistPerformance = dynamic(() => import('./components/JournalistPerformance'))
const LanguagePerformance = dynamic(() => import('./components/LanguagePerformance'))
const ArticleSize = dynamic(() => import('./components/ArticleSize'))
const ThemeWordCloud = dynamic(() => import('./components/ThemeWordCloud'))

const ReactGridLayout = WidthProvider(Responsive)

const breakpoints = { lg: 1256, md: 1024, xs: 480, xxs: 0 }

const cols = { lg: 16, md: 16, xs: 16, xxs: 16 }

const defaultLayouts = {
  lg: [
    { i: '0', x: 0, y: 0, w: 12, h: 28 }, // lg width is 10
    { i: '1', x: 0, y: 12, w: 12, h: 28 },
    { i: '2', x: 12, y: 0, w: 4, h: 56 },
    { i: '3', x: 0, y: 28, w: 16, h: 35 },
    { i: '4', x: 0, y: 58, w: 16, h: 35 },
    { i: '5', x: 0, y: 58, w: 16, h: 35 },
    { i: '6', x: 0, y: 75, w: 16, h: 35 },
    { i: '7', x: 0, y: 110, w: 16, h: 35 },
    { i: '8', x: 0, y: 145, w: 16, h: 35 },
    { i: '9', x: 0, y: 180, w: 16, h: 35 },
    { i: '10', x: 0, y: 215, w: 16, h: 35, isResizable: false },
    { i: '11', x: 0, y: 350, w: 16, h: 35 },
    { i: '12', x: 0, y: 285, w: 16, h: 35 },
    { i: '13', x: 0, y: 320, w: 16, h: 35 },
    { i: '14', x: 8, y: 355, w: 16, h: 35 }
  ],

  md: [
    { i: '0', x: 0, y: 0, w: 10, h: 28 }, // lg width is 10
    { i: '1', x: 0, y: 35, w: 10, h: 28 },
    { i: '2', x: 10, y: 0, w: 6, h: 56 },
    { i: '3', x: 0, y: 50, w: 16, h: 35 },
    { i: '4', x: 0, y: 75, w: 16, h: 35 },
    { i: '5', x: 6, y: 100, w: 16, h: 35 },
    { i: '6', x: 0, y: 135, w: 16, h: 35 },
    { i: '7', x: 0, y: 170, w: 16, h: 35 },
    { i: '8', x: 0, y: 205, w: 16, h: 35 },
    { i: '9', x: 0, y: 240, w: 16, h: 35 },
    { i: '10', x: 0, y: 275, w: 16, h: 35, isResizable: false },
    { i: '11', x: 0, y: 310, w: 16, h: 35 },
    { i: '12', x: 8, y: 345, w: 16, h: 35 },
    { i: '13', x: 0, y: 380, w: 16, h: 35 },
    { i: '14', x: 8, y: 415, w: 16, h: 35 }
  ],

  // sm: [
  //   { i: '0', x: 0, y: 0, w: 16, h: 35 }, // lg width is 10
  //   { i: '1', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '2', x: 0, y: 0, w: 16, h: 50 },
  //   { i: '3', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '4', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '5', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '6', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '7', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '8', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '9', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '10', x: 0, y: 0, w: 16, h: 35, isResizable: false },
  //   { i: '11', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '12', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '13', x: 0, y: 0, w: 16, h: 35 },
  //   { i: '14', x: 0, y: 0, w: 16, h: 35 }
  // ],
  xs: [
    { i: '0', x: 0, y: 0, w: 16, h: 35 }, // lg width is 10
    { i: '1', x: 0, y: 0, w: 16, h: 35 },
    { i: '2', x: 8, y: 0, w: 16, h: 50 },
    { i: '3', x: 0, y: 0, w: 16, h: 35 },
    { i: '4', x: 0, y: 0, w: 16, h: 35 },
    { i: '5', x: 0, y: 0, w: 16, h: 35 },
    { i: '6', x: 0, y: 0, w: 16, h: 35 },
    { i: '7', x: 0, y: 0, w: 16, h: 35 },
    { i: '8', x: 0, y: 0, w: 16, h: 35 },
    { i: '9', x: 0, y: 0, w: 16, h: 35 },
    { i: '10', x: 0, y: 0, w: 16, h: 35, isResizable: false },
    { i: '11', x: 0, y: 0, w: 16, h: 35 },
    { i: '12', x: 0, y: 0, w: 16, h: 35 },
    { i: '13', x: 0, y: 0, w: 16, h: 35 },
    { i: '14', x: 0, y: 0, w: 16, h: 35 }
  ]
}

const Page = () => {
  const matches = useMediaQuery('(min-width:1200px)')

  // const [layouts, setLayouts] = useLocalStorage({
  //   key: 'comparative',
  //   defaultValue: defaultLayouts,
  //   getInitialValueInEffect: false
  // })

  // Track loaded components
  // const [loadedComponents, setLoadedComponents] = useLocalStorage({
  //   key: 'loaded-components',
  //   defaultValue: new Set(['0', '1', '2'])
  // })

  const [layouts, setLayouts] = useState(defaultLayouts)

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
          <Comparative />
        </Box>
        <Box key='1'>
          <LazyLoad>
            <ComparativeTable />
          </LazyLoad>
        </Box>

        <Box key='2'>
          <LazyLoad>
            <ComparativePie />
          </LazyLoad>
        </Box>
        <Box key='3'>
          <LazyLoad>
            <ComparativeDataGrid />
          </LazyLoad>
        </Box>

        <Box key='4'>
          <LazyLoad>
            <MediaType matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='5'>
          <LazyLoad>
            <TopPublication matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='6'>
          <LazyLoad>
            <RegionalPerformance matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='7'>
          <LazyLoad>
            <CityPerformance matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='8'>
          <LazyLoad>
            <ThemePerformance matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='9'>
          <LazyLoad>
            <Prominence matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='10'>
          <LazyLoad>
            <ThemeWordCloud />
          </LazyLoad>
        </Box>

        <Box key='11'>
          <LazyLoad>
            <JournalistTonality />
          </LazyLoad>
        </Box>

        <Box key='12'>
          <LazyLoad>
            <JournalistPerformance matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='13'>
          <LazyLoad>
            <ArticleSize matches={matches} />
          </LazyLoad>
        </Box>

        <Box key='14'>
          <LazyLoad>
            <LanguagePerformance matches={matches} />
          </LazyLoad>
        </Box>

        {/* <Box key='24'>
          <Widget
            title='  Tonality Distribution: Industry - Print'
            openMenu={openMenu}
            data={tonality.data1.print}
            charts={{
              stacked: { component: StackChart, props: { barPercentage: 0.2 } }
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
        </Box> */}
      </ReactGridLayout>

      {/* <Card elevation={0} sx={{ p: 4 }} key='10'>
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
        </Card> */}

      {/* <Box key='11'>
          <Widget
            height={320}
            title='Colgate-Palmolive vs. Peers – Tonality Break-up'
            openMenu={openMenu}
            data={tonality.data2.online}
            charts={{
              bar: { component: BarChart, props: { barPercentage: 0.3 } },
              line: { component: LineChart },
              stacked: { component: StackChart, props: { barPercentage: 0.1 } }
            }}
          />
        </Box> */}

      {/* <Card elevation={0} sx={{ p: 4, height: { xs: 350, md: 400, lg: 500 } }} key='13'>
        <TempBarChart data={mainlines.data1.print} barPercentage={0.3} />
      </Card>

      <Card elevation={0} sx={{ p: 4, height: { xs: 350, md: 400, lg: 500 } }} key='14'>
        <TempBarChart data={businessDailies.data1.print} barPercentage={0.3} />
      </Card>

      <Card elevation={0} sx={{ p: 4, height: { xs: 450, md: 500, lg: 700 } }} key='15'>
        <MultiLabelBarChart data={businessDailies.data1.print} barPercentage={0.3} />
      </Card> */}
    </Box>
  )
}

export default Page
