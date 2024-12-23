import {
  Box,
  Button,
  Card,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Switch,
  Typography
} from '@mui/material'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import { useToggle } from '@mantine/hooks'
import React, { Fragment, useMemo, useState } from 'react'
import TimelineIcon from '@mui/icons-material/Timeline'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import PieChartIcon from '@mui/icons-material/PieChart'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import useMenu from 'src/hooks/useMenu'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Tabs, Tab } from 'src/components/tabs/Tabs'
import { All, Online, Print } from 'src/constants/filters'
import LaunchIcon from '@mui/icons-material/Launch'
import CloseIcon from '@mui/icons-material/Close'
import Loading from '../Loading'
import useModal from 'src/hooks/useModal'
import { exportChartAsJPEG, exportChartAsPDF } from './export'
import DataTable from '../datatable/Table'
import { exportColumnGroupTable, exportTable } from '../datatable/export'

const icons = {
  bar: <EqualizerIcon />,
  line: <TimelineIcon />,
  pie: <PieChartIcon />,
  doughnut: <DonutLargeIcon />,
  bubble: <BubbleChartIcon />,
  stacked: <StackedBarChartIcon />,
  table: <GridViewOutlinedIcon />
}

function Widget(props) {
  const { title, charts, table, metrics, render, mediaType, changeMediaType, height, datagrid, loading = false } = props
  const chartKeys = useMemo(() => Object.keys(charts || {}), [charts])

  const defaultChart = useMemo(() => {
    if (!render.includes('charts')) return {}

    const name = chartKeys.at(0)

    return {
      ...charts[name],
      icon: icons[name],
      name
    }
  }, [charts, chartKeys, render])

  const [Chart, setChart] = useState(defaultChart)
  const [value, toggle] = useToggle(render)
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const { anchorEl: optionAnchorEl, openMenu: openOption, closeMenu: closeOption } = useMenu()
  const { modalState, openModal, closeModal } = useModal()

  const widget = (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        height: '100%',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={1}>
        <Typography
          variant='subtitle1'
          fontWeight={500}
          sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
        >
          {title}
        </Typography>
        <Stack direction='row' alignItems='center' spacing={1} className='cancelSelection'>
          <Switch />

          <Button
            variant='outlined'
            onClick={e => {
              if (chartKeys.length > 1) return openMenu(e)
              const name = chartKeys.at(0)
              setChart({ ...charts[name], icon: icons[name], name })
              toggle('charts')
            }}
            startIcon={value === 'charts' ? Chart.icon : defaultChart.icon}
            endIcon={chartKeys.length > 1 && <ArrowDropDownIcon />}
            sx={{
              display: chartKeys.length ? 'inline-flex' : 'none',
              alignItems: 'start',
              textTransform: 'capitalize',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',

              borderColor: value === 'charts' ? 'primary.main !important' : 'grey !important',
              color: value === 'charts' ? 'primary.main' : 'grey',
              py: 1
            }}
          >
            {chartKeys.length > 1 ? Chart.name : defaultChart.name} Chart
          </Button>

          {table && (
            <IconButton
              onClick={() => {
                toggle('table')
              }}
              color={value === 'table' ? 'primary' : 'disabled'}
            >
              <GridViewOutlinedIcon />
            </IconButton>
          )}

          <IconButton onClick={modalState ? closeModal : openModal}>
            {modalState ? <CloseIcon fontSize='small' /> : <LaunchIcon fontSize='small' />}
          </IconButton>

          <IconButton onClick={openOption}>
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </Stack>
      </Stack>

      <Box flexGrow={1} className='cancelSelection' height={height || 400}>
        <Tabs
          value={mediaType}
          onChange={changeMediaType}
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
          <Tab label={All} value={All} />
          <Tab label={Print} value={Print} />
          <Tab label={Online} value={Online} />
        </Tabs>

        {loading ? (
          <Loading />
        ) : value === 'charts' ? (
          <Chart.component id={Chart.id} metrics={metrics} {...(Chart.props ?? {})} />
        ) : (
          <DataTable {...datagrid} height={330} />
        )}
      </Box>

      <Menu
        anchorEl={optionAnchorEl}
        open={Boolean(optionAnchorEl)}
        onClose={closeOption}
        className='cancelSelection'
        variant='translucent'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 300px)'
          }
        }}
      >
        <MenuItem
          onClick={() => {
            closeOption()
            if (value === 'charts') {
              exportChartAsJPEG(Chart.id)

              return
            }

            const { tableData, columns } = datagrid
            tableData.columns = columns

            exportTable(tableData, 'xlsx')
          }}
        >
          <ListItemText>Download as {value === 'charts' ? 'JPEG' : 'XLSX'}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeOption()
            if (value === 'charts') {
              exportChartAsPDF(Chart.id)

              return
            }

            const { tableData, columns } = datagrid
            tableData.columns = columns

            exportTable(tableData, 'csv')
          }}
        >
          <ListItemText>Download as {value === 'charts' ? 'PDF' : 'CSV'}</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        variant='translucent'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 200px)'
          }
        }}
      >
        {chartKeys.map(key => (
          <MenuItem
            sx={{ px: 1.2 }}
            key={key}
            selected={Chart.name === key}
            onClick={() => {
              setChart({ ...charts[key], icon: icons[key], name: key })
              toggle('charts')
              closeMenu()
            }}
          >
            <ListItemText primaryTypographyProps={{ textTransform: 'capitalize', variant: 'body2' }}>
              {key} Chart{' '}
            </ListItemText>
            <ListItemIcon sx={{ minWidth: '0 !important' }}>{icons[key]}</ListItemIcon>
          </MenuItem>
        ))}
      </Menu>
    </Card>
  )

  return (
    <Fragment>
      {widget}
      <Modal open={modalState} onClose={closeModal}>
        <>{widget}</>
      </Modal>
    </Fragment>
  )
}

export default Widget
