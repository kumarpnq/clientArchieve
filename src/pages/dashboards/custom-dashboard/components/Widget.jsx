import {
  Box,
  Button,
  Card,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography
} from '@mui/material'

import Android12Switch from 'src/components/switch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotesIcon from '@mui/icons-material/Notes'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import { useToggle } from '@mantine/hooks'
import React, { useMemo, useState } from 'react'
import TimelineIcon from '@mui/icons-material/Timeline'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import PieChartIcon from '@mui/icons-material/PieChart'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import useMenu from 'src/hooks/useMenu'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const icons = {
  bar: <EqualizerIcon />,
  line: <TimelineIcon />,
  pie: <PieChartIcon />,
  doughnut: <DonutLargeIcon />,
  bubble: <BubbleChartIcon />,
  stacked: <StackedBarChartIcon />,
  table: <NotesIcon />
}

function Widget(props) {
  const { title, openMenu: openOptions, charts, table, height } = props
  const chartKeys = useMemo(() => Object.keys(charts || {}), [charts])

  const defaultChart = useMemo(() => {
    const name = chartKeys.at(0)

    return {
      ...charts[name],
      icon: icons[name],
      name
    }
  }, [charts, chartKeys])

  const [Chart, setChart] = useState(defaultChart)
  const [value, toggle] = useToggle(['charts', 'table'])
  const { anchorEl, openMenu, closeMenu } = useMenu()

  if (chartKeys.length === 0) return null

  return (
    <Card
      elevation={0}
      sx={{
        p: 4,
        height: '100%',
        overflow: 'auto',
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
              const chart = chartKeys.at(0)
              setChart({ ...charts[chart], icon: icons[chart] })
              toggle('charts')
            }}
            startIcon={value === 'charts' ? Chart.icon : defaultChart.icon}
            endIcon={chartKeys.length > 1 && <ArrowDropDownIcon />}
            sx={{
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
              <NotesIcon />
            </IconButton>
          )}

          <IconButton onClick={openOptions}>
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </Stack>
      </Stack>
      <Box id='chart-container' position='relative' sx={{ height: height || { xs: 250, md: 300 }, overflow: 'auto' }}>
        {value === 'charts' ? <Chart.component {...(Chart.props ?? {})} /> : table}
      </Box>

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
}

export default Widget
