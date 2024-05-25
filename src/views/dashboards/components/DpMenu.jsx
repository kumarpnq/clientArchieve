import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'

const DpMenu = ({ anchorEl, handleClose, activeMenu, renderMenuItems }) => {
  return (
    <Box>
      <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl) && activeMenu === 'count'}>
        {renderMenuItems([10, 20, 30], 'count')}
      </Menu>

      <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl) && activeMenu === 'filter'}>
        {renderMenuItems(['Top', 'Bottom'], 'filter')}
      </Menu>
    </Box>
  )
}

export default DpMenu
