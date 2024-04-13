import React, { Fragment, useEffect, useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

// import IconButton from '@mui/material/IconButton'
// import TextField from '@mui/material/TextField'
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

import AdvancedSearchForm from '../dialog/advanceSearch/AdvancedSearchForm'
import DossierDialog from '../dialog/dossierDownload/DossierDialog'
import ExcelDumpDialog from '../dialog/ExcelDump/ExcelDumpDialog'
import TaggingDialog from '../dialog/tagging/TaggingDialog'
import ImageDialog from '../dialog/image/ImageDialog'
import EmailDialog from '../dialog/email/EmailDialog'
import DeleteDialog from '../dialog/delete/DeleteDialog'
import RssFeedDialog from '../dialog/RssFeed/RssFeedDialog'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { ToolPermission, useToolPermission } from 'src/hooks/showHideDownloadTools'
import { BASE_URL } from 'src/api/base'

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

// Excel Dump Icon
const ExcelDumpIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.494v20.848a.5.5 0 0 1-.57.494L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4zm-6.8 9L13 8h-2.4L9 10.286L7.4 8H5l2.8 4L5 16h2.4L9 13.714L10.6 16H13z'
      />
    </svg>
  </SvgIcon>
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

// Sort By Icon
const SortByIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='27' viewBox='0 0 36 36'>
      <path
        fill='currentColor'
        d='M28.54 13H7.46a1 1 0 0 1 0-2h21.08a1 1 0 0 1 0 2'
        class='clr-i-outline clr-i-outline-path-1'
      />
      <path
        fill='currentColor'
        d='M21.17 19H7.46a1 1 0 0 1 0-2h13.71a1 1 0 0 1 0 2'
        class='clr-i-outline clr-i-outline-path-2'
      />
      <path
        fill='currentColor'
        d='M13.74 25H7.46a1 1 0 0 1 0-2h6.28a1 1 0 0 1 0 2'
        class='clr-i-outline clr-i-outline-path-3'
      />
      <path fill='none' d='M0 0h36v36H0z' />
    </svg>
  </SvgIcon>
)

// Publication Type Icon
const PublicationTypeIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        fill-rule='evenodd'
        d='M5 2a1 1 0 0 0-1 1v16a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-.293-.707l-5-5A1 1 0 0 0 14 2zm9 2.414L17.586 8H14zM8 10.5A1.5 1.5 0 0 1 9.5 9h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H9.5a1.5 1.5 0 0 1-1.5-1.5zm4.707 2.793a1 1 0 0 0-1.414 0l-4 4a1 1 0 1 0 1.414 1.414L12 15.414l3.293 3.293a1 1 0 0 0 1.414-1.414z'
        clip-rule='evenodd'
      />
    </svg>
  </SvgIcon>
)

// Edition Type Icon
const EditionTypeIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='m15.66 14.694l-2.084-2.046l-.129-.117a2.25 2.25 0 0 0-2.888-.006l-.136.123l-6.233 6.124A.7.7 0 0 1 3 18.273V6.25A3.25 3.25 0 0 1 6.25 3h11.5A3.25 3.25 0 0 1 21 6.25v4.762a3.278 3.278 0 0 0-2.608.95zM13.5 8.252a2.252 2.252 0 1 0 4.504 0a2.252 2.252 0 0 0-4.505 0m2.252-.752a.752.752 0 1 1 0 1.504a.752.752 0 0 1 0-1.504m-4.278 6.218l.084-.071a.75.75 0 0 1 .873-.007l.094.078l2.075 2.037l-2.11 2.11a3.686 3.686 0 0 0-.931 1.57c-.345-.536-.87-.915-1.412-1.133c-.691-.278-1.386-.16-1.936.035l-.112.04c-.48.168-.864-.408-.53-.791l.21-.241zm7.625-1.049l-5.902 5.903a2.684 2.684 0 0 0-.706 1.247l-.428 1.712c-.355.17-.71.202-1.133.105c-.126-.03-.18-.175-.127-.293c.43-.962-.19-1.776-1.03-2.113c-.955-.385-2.226.515-3.292 1.268c-.592.42-1.12.793-1.496.876c-.525.117-1.162-.123-1.631-.38c-.209-.113-.487.072-.388.288c.242.529.731 1.133 1.71 1.255c.98.121 1.766-.347 2.55-.815c.583-.348 1.165-.696 1.826-.799c.086-.013.144.088.105.166c-.242.484-.356 1.37.218 1.818c.848.662 3.237.292 3.828.088a.982.982 0 0 0 .148-.027l1.83-.457a2.684 2.684 0 0 0 1.248-.707l5.903-5.902a2.286 2.286 0 0 0-3.233-3.232'
      />
    </svg>
  </SvgIcon>
)

// 1D Icon
// const OneDIcon = props => (
//   <SvgIcon {...props}>
//     <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
//       1D
//     </text>
//   </SvgIcon>
// )

// 7D Icon
// const SevenDIcon = props => (
//   <SvgIcon {...props}>
//     <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
//       7D
//     </text>
//   </SvgIcon>
// )

// 1M Icon
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
  handleRssFeed,
  openFilterPopover,
  filterPopoverAnchor,
  closeFilterPopover,

  selectedStartDate,
  selectedEndDate,

  // setSelectedStartDate,

  // setSelectedEndDate,
  primaryColor,
  selectedArticles,
  setSearchParameters,
  selectedEditionType,
  setSelectedEditionType,
  selectedPublicationType,
  selectedSortBy,
  setSelectedPublicationType,
  setSelectedSortBy,
  selectedFilter,
  setSelectedFilter,
  setClearAdvancedSearchField,
  clearAdvancedSearchField,
  dataForExcelDump,
  tags,
  fetchTagsFlag,
  setFetchTagsFlag,
  setDataFetchFlag,
  dataFetchFlag,
  pageCheck,
  allCheck
}) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // user permission redux tools visibility
  const { isDossierVisible, isMailVisible, isExcelDumpVisible } = useToolPermission()

  // Helper function to calculate date by subtracting days from the current date
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

  // // useEffect to set default date for 1D filter and highlight the icon when component mounts
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

  const [dossierDialogOpen, setDossierDialogOpen] = React.useState(false)

  const handleDossierDialogOpen = () => {
    setDossierDialogOpen(true)
  }

  const handleDossierDialogClose = () => {
    setDossierDialogOpen(false)
  }

  const [excelDumpDialogOpen, setExcelDumpDialogOpen] = React.useState(false)

  const handleExcelDumpDialogOpen = () => {
    setExcelDumpDialogOpen(true)
  }

  const handleExcelDumpDialogClose = () => {
    setExcelDumpDialogOpen(false)
  }

  const [taggingDialogOpen, setTaggingDialogOpen] = useState(false)

  const handleTaggingDialogOpen = () => {
    setTaggingDialogOpen(true)
  }

  const handleTaggingDialogClose = () => {
    setTaggingDialogOpen(false)
  }

  const [isImageDialogOpen, setImageDialogOpen] = useState(false)

  const handleImageDialogOpen = () => {
    setImageDialogOpen(true)
  }

  const handleImageDialogClose = () => {
    setImageDialogOpen(false)
  }

  const [isEmailDialogOpen, setEmailDialogOpen] = useState(false)

  const handleEmailDialogOpen = () => {
    setEmailDialogOpen(true)
  }

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false)
  }

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

  const [isRssFeedDialogOpen, setRssFeedDialogOpen] = useState(false)

  const handleRssFeedDialogOpen = () => {
    setRssFeedDialogOpen(true)
  }

  const handleRssFeedDialogClose = () => {
    setRssFeedDialogOpen(false)
  }

  //sortby
  const [isSortByMenuOpen, setSortByMenuOpen] = useState(null)

  const handleSortByClick = event => {
    setSortByMenuOpen(event.currentTarget)
  }

  const handleSortByClose = () => {
    setSortByMenuOpen(null)
  }

  const handleSortBySelection = sortBy => {
    if (selectedSortBy === sortBy) {
      // If the clicked sort-by is already selected, deselect it
      setSelectedSortBy(null)
    } else {
      // If not selected, set it as the selected sort-by
      setSelectedSortBy(sortBy)
    }
    handleSortByClose()
  }

  // Publication Type state and logic
  const [publicationTypes, setPublicationTypes] = useState([])
  const [isPublicationTypeMenuOpen, setPublicationTypeMenuOpen] = useState(null)

  useEffect(() => {
    const fetchPublicationTypes = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        const response = await fetch('http://51.68.220.77:8001/publicationCategoryList/', {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setPublicationTypes(data.publicationsTypeList)
      } catch (error) {
        console.error('Error fetching publication types:', error)

        // Handle error appropriately, e.g., display an error message to the user
      }
    }

    fetchPublicationTypes()
  }, []) // Fetch publication types only once on component mount

  const handlePublicationTypeClick = event => {
    setPublicationTypeMenuOpen(event.currentTarget)
  }

  const handlePublicationTypeClose = () => {
    setPublicationTypeMenuOpen(null)
  }

  const handlePublicationTypeSelection = publicationType => {
    if (selectedPublicationType && selectedPublicationType.publicationTypeId === publicationType.publicationTypeId) {
      // If the clicked publication type is already selected, deselect it
      setSelectedPublicationType('')
    } else {
      // If not selected, set it as the selected publication type
      setSelectedPublicationType(publicationType)
    }
    handlePublicationTypeClose()
  }

  // Edition Type state and logic
  const [editionTypes, setEditionTypes] = useState([])
  const [isEditionTypeMenuOpen, setEditionTypeMenuOpen] = useState(null)

  useEffect(() => {
    const fetchEditionTypes = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        const response = await fetch(`${BASE_URL}/editionTypesList/`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setEditionTypes(data.editionTypesList)
      } catch (error) {
        console.error('Error fetching edition types:', error)

        // Handle error appropriately, e.g., display an error message to the user
      }
    }

    fetchEditionTypes()
  }, []) // Fetch edition types only once on component mount

  const handleEditionTypeClick = event => {
    setEditionTypeMenuOpen(event.currentTarget)
  }

  const handleEditionTypeClose = () => {
    setEditionTypeMenuOpen(null)
  }

  const handleEditionTypeSelection = editionType => {
    const index = selectedEditionType.indexOf(editionType)

    if (index > -1) {
      // If the edition type is already selected, deselect it
      setSelectedEditionType(prevState =>
        prevState.filter(selected => selected.editionTypeId !== editionType.editionTypeId)
      )
    } else {
      // If not selected, add it to the selected edition types
      setSelectedEditionType(prevState => [...prevState, editionType])
    }
    handleEditionTypeClose()
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
      {/* {isSearchBarVisible && (
        <TextField
          label='Search Articles'
          variant='outlined'
          size='small'
          onChange={e => setSearchQuery(e.target.value)}
        />
      )}
      <Button onClick={toggleSearchBarVisibility} sx={{ color: primaryColor, mr: 0 }}>
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
        clearAdvancedSearchField={clearAdvancedSearchField}
        setClearAdvancedSearchField={setClearAdvancedSearchField}
      />

      <CustomTooltip title='Delete'>
        <Button onClick={handleDeleteDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
          <DeleteIcon />
        </Button>
      </CustomTooltip>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        selectedArticles={selectedArticles}
        setDataFetchFlag={setDataFetchFlag}
        dataFetchFlag={dataFetchFlag}
      />
      {isMailVisible && (
        <Fragment>
          {' '}
          <CustomTooltip title='Email'>
            <Button onClick={handleEmailDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
              <EmailIcon />
            </Button>
          </CustomTooltip>
          <EmailDialog
            open={isEmailDialogOpen}
            onClose={handleEmailDialogClose}
            handleClose={handleEmailDialogClose}
            dataForMail={dataForExcelDump}
          />
        </Fragment>
      )}

      <CustomTooltip title='Image'>
        <Button onClick={handleImageDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
          <ImageIcon />
        </Button>
      </CustomTooltip>

      {/* Add the ImageDialog component */}
      <ImageDialog open={isImageDialogOpen} handleClose={handleImageDialogClose} selectedArticles={selectedArticles} />
      {isDossierVisible && (
        <Fragment>
          <CustomTooltip title='Dossier'>
            <Button onClick={handleDossierDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
              <DownloadIcon />
            </Button>
          </CustomTooltip>

          {/* Add the DownloadDialog component */}
          <DossierDialog
            open={dossierDialogOpen}
            handleClose={handleDossierDialogClose}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            dataForDossierDownload={dataForExcelDump}
          />
        </Fragment>
      )}

      {isExcelDumpVisible && (
        <Fragment>
          <CustomTooltip title='Excel Dump'>
            <Button onClick={handleExcelDumpDialogOpen} sx={{ color: primaryColor, mr: 0 }}>
              <ExcelDumpIcon />
            </Button>
          </CustomTooltip>

          {/* Add the ExcelDumpDialog component */}
          <ExcelDumpDialog
            open={excelDumpDialogOpen}
            handleClose={handleExcelDumpDialogClose}
            dataForExcelDump={dataForExcelDump}
            pageCheck={pageCheck}
            allCheck={allCheck}
          />
        </Fragment>
      )}

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

      <CustomTooltip title='Sort By'>
        <Button onClick={handleSortByClick} sx={{ color: selectedSortBy ? primaryColor : undefined, mr: 0 }}>
          <SortByIcon />
        </Button>
      </CustomTooltip>

      <Menu anchorEl={isSortByMenuOpen} open={Boolean(isSortByMenuOpen)} onClose={handleSortByClose}>
        <MenuItem onClick={() => handleSortBySelection('latest')} selected={selectedSortBy === 'latest'}>
          Sort by Latest
        </MenuItem>
        <MenuItem onClick={() => handleSortBySelection('media')} selected={selectedSortBy === 'media'}>
          Sort by Media
        </MenuItem>
      </Menu>

      <CustomTooltip title='Publication'>
        <Button onClick={handlePublicationTypeClick} sx={{ color: primaryColor, mr: 0 }}>
          <PublicationTypeIcon />
        </Button>
      </CustomTooltip>

      <Menu
        anchorEl={isPublicationTypeMenuOpen}
        open={Boolean(isPublicationTypeMenuOpen)}
        onClose={handlePublicationTypeClose}
      >
        {publicationTypes.map(publicationType => (
          <MenuItem
            key={publicationType.publicationTypeId}
            onClick={() => handlePublicationTypeSelection(publicationType)}
            selected={
              selectedPublicationType && selectedPublicationType.publicationTypeId === publicationType.publicationTypeId
            }
          >
            {publicationType.publicationTypeName}
          </MenuItem>
        ))}
      </Menu>

      <CustomTooltip title='Edition'>
        <Button onClick={handleEditionTypeClick} sx={{ color: primaryColor, mr: 0 }}>
          <EditionTypeIcon />
        </Button>
      </CustomTooltip>
      <Menu anchorEl={isEditionTypeMenuOpen} open={Boolean(isEditionTypeMenuOpen)} onClose={handleEditionTypeClose}>
        {editionTypes.map(editionType => (
          <MenuItem
            key={editionType.editionTypeId}
            onClick={() => handleEditionTypeSelection(editionType)}
            selected={selectedEditionType && selectedEditionType.editionTypeId === editionType.editionTypeId}
          >
            {editionType.editionTypeName}
          </MenuItem>
        ))}
      </Menu>
      {/*
      <CustomTooltip title='Date Range'>
        <Button onClick={openFilterPopover} sx={{ color: primaryColor, mr: 0 }}>
          <DateRangeIcon />
        </Button>
      </CustomTooltip>

      // <CustomTooltip title='1 Day'>
      //   <Button
      //     onClick={handleFilter1D}
      //     sx={{ color: primaryColor, mr: 0 }}
      //     variant={selectedFilter === '1D' ? 'contained' : 'text'}
      //   >
      //     <OneDIcon />
      //   </Button>
      // </CustomTooltip>

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
