import styled from '@emotion/styled'
import { Box, IconButton, Menu, MenuItem, Paper, Tooltip, tooltipClasses } from '@mui/material'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })
)

const menuItems = [
  { label: 'Latest', icon: 'bx:time', sortKey: 'latest' },
  { label: 'Likes', icon: 'bx:like', sortKey: 'likeCount' },
  { label: 'Views', icon: 'hugeicons:analytics-01', sortKey: 'impression_count' },
  { label: 'Comments', icon: 'bx:comment', sortKey: 'commentCount' },
  { label: 'Followers', icon: 'icon-park-outline:peoples', sortKey: 'followersCount' }
]

const CompanyCard = ({ companyTitle, companyId, setCardData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSort = sortKey => {
    setCardData(prev => {
      const sortedData = prev.map(company => {
        if (company.id === companyId) {
          const sortedArticles = company.feeds.slice().sort((a, b) => {
            if (sortKey === 'latest') {
              return new Date(b.date) - new Date(a.date)
            } else {
              const aValue = a.stats[sortKey] || 0
              const bValue = b.stats[sortKey] || 0

              return bValue - aValue
            }
          })

          return {
            ...company,
            feeds: sortedArticles
          }
        }

        return company
      })

      return sortedData
    })
    handleClose()
  }

  return (
    <Box
      component={Paper}
      width={'100%'}
      sx={{ mt: 2, px: 2, py: 1, ml: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      {companyTitle}{' '}
      <CustomTooltip title='Quick Filter'>
        <IconButton onClick={handleClick} sx={{ color: 'primary.main' }}>
          <IconifyIcon icon='bx:filter' />
        </IconButton>
      </CustomTooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map(item => (
          <MenuItem key={item.label} onClick={() => handleSort(item.sortKey)} sx={{ display: 'flex', gap: 1 }}>
            <IconifyIcon icon={item.icon} />
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default CompanyCard
