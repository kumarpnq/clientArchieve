import React, { useState } from 'react'
import { Box, Card, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import data from 'src/data/data.json'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import words from 'src/data/word.json'
import useMenu from 'src/hooks/useMenu'
import WordCloud from 'src/components/charts/WordCloud'

import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useLocalStorage } from '@mantine/hooks'
import defaultLayouts from './layout'
import Comparative from './components/comparative/ComparativeChart'
import ComparativeTable from './components/comparative/ComparativeTable'
import ComparativePie from './components/comparative/ComparativePie'
import ComparativeDataGrid from './components/comparative/ComparativeDataGrid'
import MediaType from './components/MediaType'
import TopPublication from './components/TopPublication'
import RegionalPerformance from './components/RegionalPerformance'
import CityPerformance from './components/CityPerformance'
import ThemePerformance from './components/ThemePerformance'
import ProminencePresence from './components/Prominence'
import JournalistTonality from './components/JournalistTonality'
import JournalistPerformance from './components/JournalistPerformance'
import LanguagePerformance from './components/LanguagePerformance'
import ArticleSize from './components/ArticleSize'

// Breakpoints and column definitions
const breakpoints = { lg: 1256, md: 1024, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 16, md: 16, sm: 16, xs: 16, xxs: 16 }
const ReactGridLayout = WidthProvider(Responsive)

const Page = () => {
  const { companies, tonality, publications, journalist, mainlines, businessDailies, table } = data
  const { anchorEl, openMenu, closeMenu } = useMenu()

  // const { data: comparative, loading: comparativeLoading } = useChartAndGraphApi(VISIBILITY_IMAGE_SCORE, All)

  // const [layouts, setLayouts] = useLocalStorage({
  //   key: 'comparative',
  //   defaultValue: defaultLayouts,
  //   getInitialValueInEffect: false
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
          <Comparative openMenu={openMenu} />
        </Box>
        <Box key='1'>
          <ComparativeTable />
        </Box>

        <Box key='2'>
          <ComparativePie />
        </Box>
        <Box key='3'>
          <ComparativeDataGrid />
        </Box>
        {/*
        <Box key='4'>
          <Widget
            title='Industry Visibility in Mainlines – Print'
            openMenu={openMenu}
            data={publications.data1.print}
            charts={{
              bar: { component: TempBarChart, props: { barPercentage: 0.3 } },
              line: { component: LineChart },
              stacked: { component: StackChart, props: { barPercentage: 0.15 } }
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
            data={publications.data2.print}
            charts={{
              bar: { component: TempBarChart, props: { barPercentage: 0.3 } },
              line: { component: LineChart },
              stacked: { component: StackChart, props: { barPercentage: 0.15 } }
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

        <Box key='4'>
          <MediaType />
        </Box>

        <Box key='5'>
          <TopPublication />
        </Box>

        <Box key='6'>
          <RegionalPerformance />
        </Box>

        <Box key='7'>
          <CityPerformance />
        </Box>

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
        {/*
        <Card elevation={0} sx={{ p: 4, height: { xs: 350, md: 400, lg: 500 } }} key='13'>
          <BarChart data={mainlines.data1.print} barPercentage={0.3} />
        </Card>

        <Card elevation={0} sx={{ p: 4, height: { xs: 350, md: 400, lg: 500 } }} key='14'>
          <BarChart data={businessDailies.data1.print} barPercentage={0.3} />
        </Card>

        <Card elevation={0} sx={{ p: 4, height: { xs: 450, md: 500, lg: 700 } }} key='15'>
          <MultiLabelBarChart data={businessDailies.data1.print} barPercentage={0.3} />
        </Card> */}

        <Box key='8'>
          <ThemePerformance />
        </Box>

        <Box key='9'>
          <ProminencePresence />
        </Box>

        <Card elevation={0} sx={{ p: 4 }} key='10'>
          <WordCloud data={words.words} />
        </Card>

        <Box key='11'>
          <JournalistTonality />
        </Box>

        <Box key='12'>
          <JournalistPerformance />
        </Box>

        <Box key='13'>
          <ArticleSize />
        </Box>

        <Box key='14'>
          <LanguagePerformance />
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
