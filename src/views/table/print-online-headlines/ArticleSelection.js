// ** React Import
import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import Checkbox from '@mui/material/Checkbox'

import ToolbarComponent from './toolbar/ToolbarComponent'
import ArticleDialog from './dialog/ArticleDialog'
import ViewDialog from './dialog/MoreDialog'
import ArticleListToolbar from './toolbar/ArticleListToolbar'

// ** MUI icons
import MoreVertIcon from '@mui/icons-material/MoreVert'

// ** Article Database
import { articles } from './Db-Articles'

import useMediaQuery from '@mui/material/useMediaQuery'

import dayjs from 'dayjs'

import ArticlePopover from './ArticlePopover' // Update the path accordingly

//pagination
import Pagination from './PrintOnlinePagination.js'

import CircularProgress from '@mui/material/CircularProgress'

const TableSelection = () => {
  // State to handle popover open/close
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverSummary, setPopoverSummary] = useState('')

  const handlePopoverOpen = (event, summary) => {
    setAnchorEl(event.currentTarget)
    setPopoverSummary(summary)
    setPopoverOpen(true)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setPopoverOpen(false)
  }

  // ** Renders social feed column
  const renderArticle = params => {
    const { row } = params

    const formattedDate = dayjs(row.articleDate).format('DD-MM-YYYY')

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          noWrap
          variant='body2'
          sx={{ color: 'text.primary', fontWeight: 600 }}
          onMouseEnter={e => handlePopoverOpen(e, row.summary)}
          onMouseLeave={handlePopoverClose}
        >
          {row.headline}
        </Typography>
        <ArticlePopover
          isOpen={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handlePopoverClose}
          summary={popoverSummary}
        />
        <Typography noWrap variant='caption'>
          {row.publisher}
          <span style={{ marginLeft: '4px' }}>({formattedDate})</span>
        </Typography>
      </Box>
    )
  }

  const articleColumns = [
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Select',
      field: 'select',
      renderCell: params => (
        <Checkbox
          checked={params.row.isSelected}
          onChange={() => params.api.selectRow(params.row.articleId, !params.row.isSelected, false)}
          onClick={e => e.stopPropagation()} // Stop propagation to prevent opening the dialog
        />
      )
    },
    {
      flex: 0.6,
      minWidth: 240,
      field: 'article',
      headerName: 'Article',
      renderCell: renderArticle
    },

    {
      flex: 0.1,
      minWidth: 5,
      field: 'more',
      headerName: 'More',
      renderCell: params => (
        <IconButton
          onClick={e => {
            e.stopPropagation()
            handleEdit(params.row)
          }}
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ]
  const isNotResponsive = useMediaQuery('(min-width: 1000px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNarrowMobileView = useMediaQuery('(max-width: 405px)')

  // ** State
  const [articles, setArticles] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 0, // Default pageSize
    totalRecords: 0 // New state for totalRecords
  })
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)
  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const getRowId = row => row.articleId
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(10)

  const handleEdit = row => {
    setSelectedArticle(row)
    setEditDialogOpen(true)
  }

  const handleSaveChanges = editedArticle => {
    // Add logic to save changes to the article
    console.log('Saving changes:', editedArticle)
  }

  // Fetch social feeds based on the provided API
  const fetchArticles = async () => {
    try {
      setLoading(true)
      const storedToken = localStorage.getItem('accessToken')
      const userData = JSON.parse(localStorage.getItem('userData')) // Parse JSON string to object
      const storedClientId = userData?.clientId // Access clientId from userData

      if (storedToken) {
        const base_url = 'http://51.68.220.77:8001'

        const request_params = {
          clientIds: storedClientId,
          companyIds: selectedCompanyId,
          fromDate: selectedStartDate?.toISOString(),
          toDate: selectedEndDate?.toISOString(),
          page: currentPage,
          recordsPerPage: recordsPerPage
        }

        console.log(selectedEndDate?.toISOString())
        console.log(selectedEndDate?.toISOString())

        const response = await axios.get(`${base_url}/clientWiseSocialFeedAndArticles/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params
        })

        const totalRecords = response.data.totalAllArticles

        // Assuming the API response contains socialFeeds
        setArticles(response.data.allArticles)

        // Update totalRecords in the state
        setPaginationModel(prevPagination => ({
          ...prevPagination,
          totalRecords
        }))
      }
    } catch (error) {
      console.error('Error fetching social feeds:', error)
    } finally {
      setLoading(false) // Set loading to false after API call is complete
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [selectedEndDate, selectedStartDate, currentPage, recordsPerPage])

  // Filter articles based on the selected date range and search query
  const filteredArticles = useMemo(() => {
    let result = articles

    // Apply date range filter
    if (selectedStartDate && selectedEndDate) {
      result = result.filter(article => {
        const articleDate = new Date(article.date)

        return articleDate >= selectedStartDate && articleDate <= selectedEndDate
      })
    }

    // Apply search query filter
    if (searchQuery) {
      result = result.filter(
        article =>
          article.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.shortHeading.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply duration filter
    if (selectedDuration) {
      const currentDate = new Date()
      const startDate = new Date(currentDate)

      if (selectedDuration === 1) {
        startDate.setDate(currentDate.getDate() - 1)
      } else if (selectedDuration === 7) {
        startDate.setDate(currentDate.getDate() - selectedDuration)
      } else if (selectedDuration === 30) {
        startDate.setMonth(currentDate.getMonth() - 1)
      }

      result = result.filter(article => {
        const articleDate = new Date(article.date)

        return articleDate >= startDate && articleDate <= currentDate
      })
    }

    return result
  }, [selectedStartDate, selectedEndDate, searchQuery, selectedDuration])

  // Divide social feeds into left and right columns
  const leftArticles = articles.filter((_, index) => index % 2 === 0)
  const rightArticles = articles.filter((_, index) => index % 2 !== 0)

  // Open the date filter popover
  const openFilterPopover = event => {
    setFilterPopoverAnchor(event.currentTarget)
  }

  // Close the date filter popover
  const closeFilterPopover = () => {
    setFilterPopoverAnchor(null)
  }

  // Function to toggle search bar visibility
  const toggleSearchBarVisibility = () => {
    setIsSearchBarVisible(prev => !prev)
  }

  const handleDelete = () => {
    // Add your delete logic here
    console.log('Delete action triggered')
  }

  // Function to handle search action
  const handleSearch = () => {
    // Add your search logic here
    console.log('Search action triggered')
  }

  const handleEmail = () => {
    // Add your search logic here
    console.log('Search action triggered')
  }

  const handleImage = () => {
    // Add your search logic here
    console.log('Search action triggered')
  }

  const handleDownload = () => {
    // Add your search logic here
    console.log('Search action triggered')
  }

  const handleRssFeed = () => {
    // Add your search logic here
    console.log('Search action triggered')
  }

  const handleFilter1D = () => {
    setSelectedDuration(1)
  }

  const handleFilter7D = () => {
    setSelectedDuration(7)
  }

  const handleFilter1M = () => {
    setSelectedDuration(30)
  }

  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isPopupOpen, setPopupOpen] = useState(false)

  const handleRowClick = params => {
    setSelectedArticle(params.row)
    setPopupOpen(true)
  }

  const handleLeftPagination = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  }

  // Function to handle right pagination
  const handleRightPagination = () => {
    if (currentPage < Math.ceil(paginationModel.totalRecords / paginationModel.pageSize)) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const handleRecordsPerPageChange = event => {
    const newRecordsPerPage = parseInt(event.target.value, 10)
    setRecordsPerPage(newRecordsPerPage)
    setCurrentPage(1) // Reset current page when changing records per page
  }

  return (
    <Card>
      <CardHeader title='Article Selection' />
      {/* Top Toolbar */}
      <ToolbarComponent selectedCompanyId={selectedCompanyId} setSelectedCompanyId={setSelectedCompanyId} />
      {/* Toolbar with Date Filter */}
      <ArticleListToolbar
        setSearchQuery={setSearchQuery}
        isSearchBarVisible={isSearchBarVisible}
        toggleSearchBarVisibility={toggleSearchBarVisibility}
        handleDelete={handleDelete}
        handleEmail={handleEmail}
        handleImage={handleImage}
        handleDownload={handleDownload}
        handleRssFeed={handleRssFeed}
        openFilterPopover={openFilterPopover}
        handleFilter1D={handleFilter1D}
        handleFilter7D={handleFilter7D}
        handleFilter1M={handleFilter1M}
        filterPopoverAnchor={filterPopoverAnchor}
        closeFilterPopover={closeFilterPopover}
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
      />
      {/* DataGrid */}
      <Box p={2}>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {isNotResponsive ? (
              <Box display='flex'>
                {isMobileView ? null : (
                  <Box flex='1' p={2} pr={1}>
                    <DataGrid
                      autoHeight
                      rows={leftArticles}
                      columns={articleColumns}
                      pagination={false} // Remove pagination
                      onRowClick={params => handleRowClick(params)}
                      getRowId={getRowId}
                      hideFooter
                    />
                  </Box>
                )}

                {/* Right Column */}
                <Box flex='1' p={2} pl={isMobileView ? 0 : 1}>
                  <DataGrid
                    autoHeight
                    rows={rightArticles}
                    columns={articleColumns}
                    pagination={false} // Remove pagination
                    onRowClick={params => handleRowClick(params)}
                    getRowId={getRowId}
                    hideFooter
                  />
                </Box>
              </Box>
            ) : (
              <DataGrid
                autoHeight
                rows={articles}
                columns={articleColumns.filter(column => {
                  // Check if it's mobile view and exclude only the "Select" and "Edit" columns
                  if (isMobileView) {
                    return (
                      column.field !== 'select' &&
                      column.field !== 'edit' &&
                      !(column.field === 'date' && isNarrowMobileView)
                    )
                  }

                  return true
                })}
                pagination={false} // Remove pagination
                onRowClick={params => handleRowClick(params)}
                getRowId={getRowId}
                hideFooter
              />
            )}
            {articles.length > 0 && ( // Only render pagination if there are articles
              <Pagination
                paginationModel={paginationModel}
                currentPage={currentPage}
                recordsPerPage={recordsPerPage}
                handleLeftPagination={handleLeftPagination}
                handleRightPagination={handleRightPagination}
                handleRecordsPerPageChange={handleRecordsPerPageChange}
              />
            )}
          </>
        )}
      </Box>
      {/* Popup Window */}
      <ArticleDialog open={isPopupOpen} handleClose={() => setPopupOpen(false)} article={selectedArticle} />{' '}
      {/* Edit Dialog */}
      <ViewDialog
        open={isEditDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        socialFeed={selectedArticle}
        handleSave={handleSaveChanges}
      />
    </Card>
  )
}

export default TableSelection
