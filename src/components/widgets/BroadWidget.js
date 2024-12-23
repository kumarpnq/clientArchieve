import dynamic from 'next/dynamic'
import {
  Box,
  Button,
  Card,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Typography
} from '@mui/material'

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
import DownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import AbcIcon from '@mui/icons-material/Abc'
import useMenu from 'src/hooks/useMenu'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Tabs, Tab } from 'src/components/Tabs'
import { All, Online, Print } from 'src/constants/filters'

const WidgetToolbar = dynamic(() => import('./actions/WidgetToolbar'))
import Loading from '../Loading'
import useModal from 'src/hooks/useModal'
import { exportChartAsJPEG, exportChartAsPDF } from './export'

const icons = {
  bar: <EqualizerIcon />,
  line: <TimelineIcon />,
  pie: <PieChartIcon />,
  doughnut: <DonutLargeIcon />,
  bubble: <BubbleChartIcon />,
  stacked: <StackedBarChartIcon />,
  wordCloud: <AbcIcon />,
  table: <GridViewOutlinedIcon />
}

function BroadWidget(props) {
  const {
    title,
    description,
    charts,
    table,
    containerStyle = {},
    datagrid,
    apiActions,
    metrics,
    mediaType,
    changeMediaType,
    render,
    loading = false
  } = props

  const lookup = useMemo(() => ({ charts: Chart, table }), [table])

  const [value, toggle] = useToggle(render)
  const Component = useMemo(() => lookup[value], [value, lookup])
  const { modalState, openModal, closeModal } = useModal()

  const widget = (
    <Card elevation={0} sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
        <div className='cancelSelection'>
          <Typography
            variant='h5'
            fontWeight={500}
            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
          >
            {title}
          </Typography>
          <Typography
            variant='body2'
            color='text.tertiary'
            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
          >
            {description}
          </Typography>
        </div>
        <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
          <Tabs value={mediaType} onChange={changeMediaType} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={All} value={All} />
            <Tab label={Print} value={Print} />
            <Tab label={Online} value={Online} />
          </Tabs>
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />
      <Box className='cancelSelection' pb={2} sx={{ height: 400, flexGrow: 1, ...containerStyle }}>
        {loading ? (
          <Loading width={250} />
        ) : (
          <Component
            {...datagrid}
            charts={charts}
            metrics={metrics}
            slots={{ toolbar: WidgetToolbar }}
            slotProps={{ toolbar: { value, toggle, render, apiActions, openModal, closeModal, modalState } }}
          />
        )}
      </Box>
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

function Chart(props) {
  const { slots, slotProps, metrics, charts } = props
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const { anchorEl: downloadAnchorEl, openMenu: openDownloadMenu, closeMenu: closeDownloadMenu } = useMenu()

  const chartKeys = useMemo(() => Object.keys(charts || {}), [charts])

  const defaultChart = useMemo(() => {
    const name = chartKeys.at(0)

    return {
      ...charts[name],
      icon: icons[name],
      name
    }
  }, [charts, chartKeys])

  const [SelectedChart, setSelectedChart] = useState(defaultChart)

  const actions = useMemo(
    () => (
      <Fragment>
        {chartKeys.length > 1 && (
          <Button
            variant='outlined'
            onClick={e => {
              if (chartKeys.length > 1) return openMenu(e)
              const name = chartKeys.at(0)
              setSelectedChart({ ...charts[name], icon: icons[name], name })
            }}
            startIcon={SelectedChart.icon}
            endIcon={chartKeys.length > 1 && <ArrowDropDownIcon />}
            sx={{
              alignItems: 'start',
              textTransform: 'capitalize',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              borderColor: 'divider',
              py: 1
            }}
          >
            {chartKeys.length > 1 ? SelectedChart.name : defaultChart.name} Chart
          </Button>
        )}
        <Button
          variant='outlined'
          onClick={openDownloadMenu}
          startIcon={<DownloadOutlinedIcon />}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            alignItems: 'start',
            textTransform: 'capitalize',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            borderColor: 'divider',
            py: 1
          }}
        >
          Export
        </Button>
      </Fragment>
    ),
    [SelectedChart.name, SelectedChart.icon, chartKeys, charts, defaultChart, openDownloadMenu, openMenu]
  )

  if (chartKeys.length === 0) return null

  return (
    <Fragment>
      <slots.toolbar {...slotProps.toolbar} actions={actions} />
      {metrics ? (
        <SelectedChart.component id={SelectedChart.id} metrics={metrics} {...(SelectedChart.props ?? {})} />
      ) : null}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 200px)',
            p: 0.5,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        {chartKeys.map(key => (
          <MenuItem
            sx={{ px: 1.2 }}
            key={key}
            selected={SelectedChart.name === key}
            onClick={() => {
              setSelectedChart({ ...charts[key], icon: icons[key], name: key })
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

      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={closeDownloadMenu}
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 220px)',
            mt: 2,
            p: 0.2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        <MenuItem
          sx={{ px: 1.2 }}
          onClick={() => {
            exportChartAsJPEG(SelectedChart.id)
            closeDownloadMenu()
          }}
        >
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Download as JPEG</ListItemText>
        </MenuItem>
        <MenuItem
          sx={{ px: 1.2 }}
          onClick={() => {
            exportChartAsPDF(SelectedChart.id)
            closeDownloadMenu()
          }}
        >
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Download as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default BroadWidget
