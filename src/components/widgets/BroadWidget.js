import {
  Box,
  Button,
  Card,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import AbcIcon from '@mui/icons-material/Abc'
import useMenu from 'src/hooks/useMenu'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Tabs, Tab } from 'src/components/Tabs'
import { All, Online, Print } from 'src/constants/filters'

import Lottie from 'lottie-react'
import loader from 'public/loader.json'
import WidgetToolbar from './actions/WidgetToolbar'
import DataGrid from '../datagrid/DataGrid'
import Loading from '../Loading'

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

const lookup = {
  table: DataGrid,
  charts: Chart
}

function BroadWidget(props) {
  const {
    title,
    description,
    charts,
    height,
    datagrid,
    apiActions,
    metrics,
    mediaType,
    changeMediaType,
    render,
    loading = false
  } = props

  const components = useMemo(() => render || Object.keys(lookup), [render])
  const [value, toggle] = useToggle(components)
  const Component = useMemo(() => lookup[value], [value])

  return (
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
      <Box flexGrow={1} className='cancelSelection' height={height || 400}>
        {loading ? (
          <Loading width={250} />
        ) : (
          <Component
            {...datagrid}
            charts={charts}
            metrics={metrics}
            slots={{ toolbar: WidgetToolbar }}
            slotProps={{ toolbar: { value, toggle, components, apiActions } }}
          />
        )}
      </Box>
    </Card>
  )
}

function Chart(props) {
  const { slots, slotProps, metrics, charts } = props
  const { anchorEl, openMenu, closeMenu } = useMenu()

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

  if (chartKeys.length === 0) return null

  const actions = (
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
    </Fragment>
  )

  return (
    <Fragment>
      <slots.toolbar {...slotProps.toolbar} actions={actions} />
      <SelectedChart.component metrics={metrics} {...(SelectedChart.props ?? {})} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        disableScrollLock
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
    </Fragment>
  )
}

export default BroadWidget
