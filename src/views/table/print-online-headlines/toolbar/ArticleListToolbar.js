import React, { Fragment, useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

// import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

// import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import ImageIcon from '@mui/icons-material/Image'
import DownloadIcon from '@mui/icons-material/Download'
import RssFeedIcon from '@mui/icons-material/RssFeed'

// import DateRangeIcon from '@mui/icons-material/DateRange'
import Button from '@mui/material/Button'

// import Divider from '@mui/material/Divider'
// import Popover from '@mui/material/Popover'
// import Stack from '@mui/material/Stack'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import ClearIcon from '@mui/icons-material/Clear'
// import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import useMediaQuery from '@mui/material/useMediaQuery'

// import dayjs from 'dayjs'

// import Menu from '@mui/material/Menu'
// import MenuItem from '@mui/material/MenuItem'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import AdvancedSearchForm from '../dialog/advance-search/AdvanceSearchForm'
import DeleteDialog from '../dialog/delete/DeleteDialog'
import EmailDialog from '../dialog/email/EmailDialog'
import ImageDialog from '../dialog/image/ImageDialog'
import DossierDialog from '../dialog/download/DossierDownload'
import RssFeedDialog from '../dialog/rss-feed/RssFeedDialog'
import { useToolPermission } from 'src/hooks/showHideDownloadTools'
import TaggingDialog from '../dialog/tagging/taggingDialogPOH'

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.primary.main, // Set the background color to the primary theme color
      color: theme.palette.common.white, // Set the text color to white or another suitable color
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })
)

// Tagging Icon
const TaggingIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width='25' height='24' viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42'
      />
    </svg>
  </SvgIcon>
)

// Advanced Search Icon
const AdvancedSearchIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width='27' height='25' viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='m15.5 14l5 5l-1.5 1.5l-5-5v-.79l-.27-.28A6.471 6.471 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27zm-6 0C12 14 14 12 14 9.5S12 5 9.5 5S5 7 5 9.5S7 14 9.5 14m2.5-4h-2v2H9v-2H7V9h2V7h1v2h2z'
      />
    </svg>
  </SvgIcon>
)

// // 1D Icon
// const OneDIcon = props => (
//   <SvgIcon {...props}>
//     <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
//       1D
//     </text>
//   </SvgIcon>
// )

// // 7D Icon
// const SevenDIcon = props => (
//   <SvgIcon {...props}>
//     <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
//       7D
//     </text>
//   </SvgIcon>
// )

// // 1M Icon
// const OneMIcon = props => (
//   <SvgIcon {...props}>
//     <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
//       1M
//     </text>
//   </SvgIcon>
// )

const ArticleListToolbar = ({
  setSearchQuery,
  isSearchBarVisible,
  toggleSearchBarVisibility,
  handleDelete,
  handleEmail,
  handleImage,
  handleDownload,
  handleRssFeed,
  openFilterPopover,
  filterPopoverAnchor,
  closeFilterPopover,

  selectedStartDate,
  selectedEndDate,
  primaryColor,
  setSearchParameters,
  selectedArticles,
  tags,
  fetchTagsFlag,
  setFetchTagsFlag,
  dataForDump
}) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
  console.log(tags)

  //tools visibility
  const { isDossierVisible, isMailVisible } = useToolPermission()

  // const [selectedFilter, setSelectedFilter] = useState('1D')

  // // Helper function to calculate date by subtracting days from the current date
  // const calculateDate = days => dayjs().subtract(days, 'day')

  // Function to handle 1D filter
  // const handleFilter1D = () => {
  //   const startDate = calculateDate(1)
  //   setSelectedStartDate(startDate)
  //   setSelectedEndDate(startDate)
  //   setSelectedFilter('1D')
  // }

  // // Function to handle 7D filter
  // const handleFilter7D = () => {
  //   const startDate = calculateDate(7)
  //   setSelectedStartDate(startDate)
  //   setSelectedEndDate(dayjs()) // Set end date to today
  //   setSelectedFilter('7D')
  // }

  // // Function to handle 1M filter
  // const handleFilter1M = () => {
  //   const startDate = calculateDate(30)
  //   setSelectedStartDate(startDate)
  //   setSelectedEndDate(dayjs()) // Set end date to today
  //   setSelectedFilter('1M')
  // }

  // useEffect to set default date for 1D filter and highlight the icon when component mounts
  // useEffect(() => {
  //   handleFilter1D()
  // }, []) // Empty dependency array to run the effect only once

  const [isAdvancedSearchOpen, setAdvancedSearchOpen] = useState(false)

  const handleAdvancedSearchOpen = () => {
    setAdvancedSearchOpen(true)
  }

  const handleAdvancedSearchClose = () => {
    setAdvancedSearchOpen(false)
  }
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }
  const [isEmailDialogOpen, setEmailDialogOpen] = useState(false)

  const handleEmailDialogOpen = () => {
    setEmailDialogOpen(true)
  }

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false)
  }
  const [isImageDialogOpen, setImageDialogOpen] = useState(false)

  const handleImageDialogOpen = () => {
    setImageDialogOpen(true)
  }

  const handleImageDialogClose = () => {
    setImageDialogOpen(false)
  }
  const [dossierDialogOpen, setDossierDialogOpen] = React.useState(false)

  const handleDossierDialogOpen = () => {
    setDossierDialogOpen(true)
  }

  const handleDossierDialogClose = () => {
    setDossierDialogOpen(false)
  }
  const [taggingDialogOpen, setTaggingDialogOpen] = useState(false)

  const handleTaggingDialogOpen = () => {
    setTaggingDialogOpen(true)
  }

  const handleTaggingDialogClose = () => {
    setTaggingDialogOpen(false)
  }
  const [isRssFeedDialogOpen, setRssFeedDialogOpen] = useState(false)

  const handleRssFeedDialogOpen = () => {
    setRssFeedDialogOpen(true)
  }

  const handleRssFeedDialogClose = () => {
    setRssFeedDialogOpen(false)
  }

  return (
    <Toolbar
      sx={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {!isMobile && (
        <Typography variant='h6' sx={{ flex: '1' }}>
          Feed List
        </Typography>
      )}
      {isSearchBarVisible && (
        <TextField
          label='Search Articles'
          variant='outlined'
          size='small'
          onChange={e => setSearchQuery(e.target.value)}
        />
      )}
      {/* <Button onClick={toggleSearchBarVisibility} sx={{ color: primaryColor, mr: 0 }}>
        <SearchIcon />
      </Button> */}
      <CustomTooltip title='Advance Search'>
        <Button sx={{ color: primaryColor, mr: 0 }} onClick={handleAdvancedSearchOpen}>
          <AdvancedSearchIcon />
        </Button>
      </CustomTooltip>
      <AdvancedSearchForm
        open={isAdvancedSearchOpen}
        onClose={handleAdvancedSearchClose}
        setSearchParameters={setSearchParameters}
      />
      <CustomTooltip title='Delete'>
        <Button onClick={handleDeleteDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
          <DeleteIcon />
        </Button>
      </CustomTooltip>
      <DeleteDialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose} />
      {isMailVisible && (
        <Fragment>
          <CustomTooltip title='Email'>
            <Button onClick={handleEmailDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
              <EmailIcon />
            </Button>
          </CustomTooltip>
          <EmailDialog open={isEmailDialogOpen} onClose={handleEmailDialogClose} dataForMailDump={dataForDump} />
        </Fragment>
      )}

      <CustomTooltip title='Image'>
        <Button onClick={handleImageDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
          <ImageIcon />
        </Button>
      </CustomTooltip>
      <ImageDialog open={isImageDialogOpen} handleClose={handleImageDialogClose} selectedArticles={selectedArticles} />
      {isDossierVisible && (
        <Fragment>
          <CustomTooltip title='Dossier'>
            <Button onClick={handleDossierDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
              <DownloadIcon />
            </Button>
          </CustomTooltip>

          <DossierDialog
            open={dossierDialogOpen}
            handleClose={handleDossierDialogClose}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            dataForDossierDownload={dataForDump}
          />
        </Fragment>
      )}
      <CustomTooltip title='Tagging'>
        <Button onClick={handleTaggingDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
          <TaggingIcon />
        </Button>
      </CustomTooltip>
      {/* Render the TaggingDialog with the open state and onClose function */}
      <TaggingDialog
        open={taggingDialogOpen}
        onClose={handleTaggingDialogClose}
        selectedArticles={selectedArticles}
        tags={tags}
        fetchTagsFlag={fetchTagsFlag}
        setFetchTagsFlag={setFetchTagsFlag}
      />
      <CustomTooltip title='Feed'>
        <Button onClick={handleRssFeedDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
          <RssFeedIcon />
        </Button>
      </CustomTooltip>
      <RssFeedDialog
        open={isRssFeedDialogOpen}
        handleClose={handleRssFeedDialogClose}
        selectedArticles={selectedArticles}
      />
      {/* <CustomTooltip title='Date Range'>
        <Button onClick={openFilterPopover} sx={{ color: primaryColor, mr: 0 }}>
          <DateRangeIcon />
        </Button>
      </CustomTooltip>
      <CustomTooltip title='1 Day'>
        <Button
          onClick={handleFilter1D}
          sx={{ color: primaryColor, mr: 0 }}
          variant={selectedFilter === '1D' ? 'contained' : 'text'}
        >
          <OneDIcon />
        </Button>
      </CustomTooltip>
      <CustomTooltip title='7 Days'>
        <Button
          onClick={handleFilter7D}
          sx={{ color: primaryColor, mr: 0 }}
          variant={selectedFilter === '7D' ? 'contained' : 'text'}
        >
          <SevenDIcon />
        </Button>
      </CustomTooltip>
      <CustomTooltip title='1 Month'>
        <Button
          onClick={handleFilter1M}
          sx={{ color: primaryColor, mr: 0 }}
          variant={selectedFilter === '1M' ? 'contained' : 'text'}
        >
          <OneMIcon />
        </Button>
      </CustomTooltip>
      <Popover
        open={Boolean(filterPopoverAnchor)}
        anchorEl={filterPopoverAnchor}
        onClose={closeFilterPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Stack spacing={2} p={2} sx={{ minWidth: '200px', minHeight: '200px' }}>
          <Typography variant='subtitle2'>Filter by Date Range</Typography>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display='flex' alignItems='center'>
              <DatePicker label='Start Date' value={selectedStartDate} onChange={date => setSelectedStartDate(date)} />
              {selectedStartDate && (
                <IconButton onClick={() => setSelectedStartDate(null)}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
            <Box display='flex' alignItems='center'>
              <DatePicker label='End Date' value={selectedEndDate} onChange={date => setSelectedEndDate(date)} />
              {selectedEndDate && (
                <IconButton onClick={() => setSelectedEndDate(null)}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
          </LocalizationProvider>
          <Button
            onClick={() => {
              setSelectedStartDate(null)
              setSelectedEndDate(null)
            }}
          >
            Clear
          </Button>
        </Stack>
      </Popover> */}
    </Toolbar>
  )
}

export default ArticleListToolbar
