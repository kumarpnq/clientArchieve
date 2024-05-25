// * mui
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'

// * custom
import IconifyIcon from 'src/@core/components/icon'

const CardActions = ({
  chartIndexAxis,
  activeChart,
  setActiveChart,
  setChartIndexAxis,
  checked,
  handleChange,
  handleIconClick,
  anchorEl,
  handleClose,
  asPath,
  currentPath,
  handleRemoveCharts,
  reportId,
  reportActionLoading,
  setOpenAddPopup,
  setActiveMenu,
  activeType,
  handleMenuClick,
  chartData
}) => {
  return (
    <Box>
      {chartIndexAxis === 'x' ? (
        <IconButton
          onClick={() => {
            setActiveChart('Bar')
            setChartIndexAxis('y')
          }}
          sx={{
            backgroundColor: activeChart === 'Bar' ? 'primary.main' : '',
            color: activeChart === 'Bar' ? 'inherit' : 'primary.main'
          }}
        >
          <IconifyIcon icon='ic:baseline-bar-chart' />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => {
            setActiveChart('Bar')
            setChartIndexAxis('x')
          }}
          sx={{
            backgroundColor: activeChart === 'Bar' ? 'primary.main' : '',
            color: activeChart === 'Bar' ? 'inherit' : 'primary.main',
            transform: 'rotate(90deg)'
          }}
        >
          <IconifyIcon icon='ic:baseline-bar-chart' />
        </IconButton>
      )}
      <IconButton
        onClick={() => setActiveChart('Line')}
        sx={{
          backgroundColor: activeChart === 'Line' ? 'primary.main' : '',
          color: activeChart === 'Line' ? 'inherit' : 'primary.main'
        }}
      >
        <IconifyIcon icon='lets-icons:line-up' />
      </IconButton>
      <Switch
        checked={checked}
        onChange={handleChange}
        sx={{ color: activeChart === 'Line' ? 'inherit' : 'primary.main' }}
        inputProps={{ 'aria-label': 'toggle button' }}
      />
      <IconButton aria-haspopup='true' onClick={handleIconClick}>
        <IconifyIcon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
        {asPath !== currentPath ? (
          <MenuItem onClick={() => handleRemoveCharts(reportId)}>
            {reportActionLoading ? <CircularProgress /> : 'Remove from Custom'}
          </MenuItem>
        ) : (
          <MenuItem onClick={() => setOpenAddPopup(true)}>Add To Custom</MenuItem>
        )}
        <MenuItem onClick={() => setActiveMenu('count')}>Count</MenuItem>
        <MenuItem onClick={() => setActiveMenu('filter')}>Filter</MenuItem>
        {activeType === 'chart' ? (
          <>
            {' '}
            <MenuItem onClick={() => handleMenuClick('table')}>Table</MenuItem>
            <MenuItem onClick={() => handleMenuClick('image')} disabled={!chartData.length}>
              Download Image
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('pdf')} disabled={!chartData.length}>
              Download PDF
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleMenuClick('chart')}>Chart</MenuItem>
            <MenuItem onClick={() => handleMenuClick('table')} disabled={!chartData.length}>
              Download Xlsx
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  )
}

export default CardActions
