// ** React Importu
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import Checkbox from '@mui/material/Checkbox'
import ToolbarComponent from './toolbar/ToolbarComponent'
import ArticleDialog from './dialog/ArticleDialog'
import ArticleListToolbar from './toolbar/ArticleListToolbar'
import Button from '@mui/material/Button'
import { FormControlLabel, FormGroup } from '@mui/material'

// ** MUI icons
import { Icon } from '@iconify/react'
import useMediaQuery from '@mui/material/useMediaQuery'
import dayjs from 'dayjs'

//api call
import { fetchArticles } from '../../../api/print-headlines/articleApi'

import CircularProgress from '@mui/material/CircularProgress'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate,
  selectShortCutFlag,
  selectShortCut,
  setShotCutPrint
} from 'src/store/apps/user/userSlice'

// ** Tooltip
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/system'
import { List, ListItem } from '@mui/material'
import { tooltipClasses } from '@mui/material/Tooltip'

// * component imports
import useFetchReadArticleFile from 'src/api/global/useFetchReadArticleFile'
import OptionsMenu from 'src/@core/components/option-menu'
import FullScreenJPGDialog from './dialog/view/FullScreenJPGDialog'
import FullScreenHTMLDialog from './dialog/view/FullScreenHTMLDialog'
import FullScreenPDFDialog from './dialog/view/FullScreenPDFDialog'
import FullScreenEditDetailsDialog from './dialog/view/FullScreenEditDetailsDialog'
import Pagination from './Pagination'
import { BASE_URL } from 'src/api/base'
import axios from 'axios'
import SelectBox from 'src/@core/components/select'

// Your CustomTooltip component
const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default, // Use default background color for dark theme
      color: theme.palette.text.primary, // Use primary text color for dark theme
      boxShadow: theme.shadows[1],
      fontSize: 11,
      maxWidth: '300px', // Set the maximum width for better readability
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.default // Use default background color for the arrow in dark theme
      }
    }
  })
)

const renderArticle = params => {
  const { row } = params

  const formattedDate = dayjs(row.articleDate).format('DD-MM-YYYY')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CustomTooltip title={getTooltipContent(row)} arrow>
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {row.headline}
        </Typography>
      </CustomTooltip>
      <Typography noWrap variant='caption'>
        {row.publications[0].name}
        <span style={{ marginLeft: '4px' }}>({formattedDate})</span>
      </Typography>
    </Box>
  )
}

// Function to generate tooltip content using List
const getTooltipContent = row => (
  <List>
    <ListItem>
      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
        Summary :{' '}
        <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
          {row.summary}
        </Typography>
      </Typography>
    </ListItem>
    <ListItem>
      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
        Companies :{' '}
        <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
          {row.companies.length > 1 ? row.companies.map(company => company.name).join(', ') : row.companies[0]?.name}
        </Typography>
      </Typography>
    </ListItem>
    <ListItem>
      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
        Edition Type :{' '}
        <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
          {row.editionTypeName}
        </Typography>
      </Typography>
    </ListItem>
    <ListItem>
      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
        Page Number :{' '}
        <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
          {row.pageNumber}
        </Typography>
      </Typography>
    </ListItem>
  </List>
)

const TableSelection = () => {
  const [selectedArticle, setSelectedArticle] = useState({})
  const [jpgDialogOpen, setJpgDialogOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfSrc, setPdfSrc] = useState('')
  const [editDetailsDialogOpen, setEditDetailsDialogOpen] = useState(false)
  const [articles, setArticles] = useState([])

  const { fetchReadArticleFile } = useFetchReadArticleFile(setImageSrc, setPdfSrc, setFileContent)

  const handleJpgDialogClose = () => {
    setJpgDialogOpen(false)
    setImageSrc('')
  }

  const handleHtmlDialogClose = () => {
    setHtmlDialogOpen(false)
    setFileContent('')
  }

  const handlePdfDialogClose = () => {
    setPdfDialogOpen(false)
    setPdfSrc('')
  }

  const handleEditDetailsDialogClose = () => {
    setEditDetailsDialogOpen(false)
    setImageSrc('')
  }

  // * temp
  const [selectedItems, setSelectedItems] = useState([])

  const publications = [
    { publicationName: 'The Hindu', publicationId: 'hindu' },
    { publicationName: 'The Muslim', publicationId: 'muslim' },
    { publicationName: 'The Christian', publicationId: 'christian' }
  ]

  const articleColumns = [
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Select',
      field: 'select',
      renderCell: params => (
        <Checkbox
          onClick={e => {
            e.stopPropagation()
            handleSelect(params.row)
          }}
          checked={selectedArticles.some(selectedArticle => selectedArticle.articleId === params.row.articleId)}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Grp',
      field: 'Grp',
      renderCell: params => {
        const publications = params.row.publications || []
        return (
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{ sx: { color: Boolean(publications.length) ? 'primary.main' : 'primary' } }}
            renderItem='name'
            renderKey='id'
            menuItems={publications}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        )
      }
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
        <OptionsMenu
          iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
          options={[
            {
              text: 'View Article',
              menuItemProps: {
                onClick: () => {
                  const articleCode = params.row.link
                  window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                }
              }
            },
            {
              text: 'Edit Detail',
              menuItemProps: {
                onClick: () => {
                  fetchReadArticleFile('jpg', params.row)
                  setEditDetailsDialogOpen(true)
                  setSelectedArticle(params.row)
                }
              }
            }
          ]}
        />
      )
    }
  ]

  const isNotResponsive = useMediaQuery('(min-width: 1000px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNarrowMobileView = useMediaQuery('(max-width: 405px)')

  // ** State

  const [tags, setTags] = useState([])
  const [fetchTagsFlag, setFetchTagsFlag] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 0, // Default pageSize
    totalRecords: 0 // New state for totalRecords
  })
  const [selectedFilter, setSelectedFilter] = useState('1D')

  // const [selectedStartDate, setSelectedStartDate] = useState(null)
  // const [selectedEndDate, setSelectedEndDate] = useState(null)
  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const getRowId = row => row.articleId
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(100)

  const shortCutData = useSelector(selectShortCut)

  // const [selectedCompanyIds, setSelectedCompanyIds] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])

  // setSelectedMedia([shortCutData?.searchCriteria?.media])

  const [selectedTag, setSelectedTag] = useState([])
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])

  const [selectedEditionType, setSelectedEditionType] = useState([])
  const [selectedPublicationType, setSelectedPublicationType] = useState([])

  const [selectedSortBy, setSelectedSortBy] = useState(null)
  const [pageCheck, setPageCheck] = useState(false)
  const [allCheck, setAllCheck] = useState(false)
  const [dataFetchFlag, setDataFetchFlag] = useState(false)

  const [searchParameters, setSearchParameters] = useState({
    searchHeadline: '',
    searchBody: '',
    combinationOfWords: '',
    anyOfWords: '',
    exactPhrase: '',
    ignoreThis: '',
    journalist: ''
  })
  const [selectedArticles, setSelectedArticles] = useState([])

  const selectedMediaWithoutLastDigit = selectedMedia.map(item => {
    const lastChar = item.slice(-1)
    if (!isNaN(parseInt(lastChar))) {
      return item.slice(0, -1)
    }

    return item
  })
  const result = selectedMediaWithoutLastDigit.join(', ')

  const edition = selectedEditionType?.map(i => {
    return i.editionTypeId
  })

  const publicationtype = selectedPublicationType.map(i => {
    return i.publicationTypeId
  })

  const dataForExcelDump = [
    selectedCities.length && { geography: selectedCities },
    selectedMedia.length && { media: result },
    selectedLanguages.length && {
      language: selectedLanguages.map(i => {
        return i.id
      })
    },

    selectedTag.length && { tags: selectedTag },
    selectedEditionType && { editionType: edition },
    selectedPublicationType && {
      publicationCategory: publicationtype
    },
    selectedSortBy && { sortby: selectedSortBy },
    searchParameters.searchHeadline && { headline: searchParameters.searchHeadline },
    searchParameters.searchBody && { body: searchParameters.searchBody },
    searchParameters.journalist && { journalist: searchParameters.journalist },
    searchParameters.combinationOfWords && { wordCombo: searchParameters.combinationOfWords },
    searchParameters.anyOfWords && { anyWord: searchParameters.anyOfWords },
    searchParameters.ignoreThis && { ignoreWords: searchParameters.ignoreThis },
    searchParameters.exactPhrase && { phrase: searchParameters.exactPhrase },
    selectedArticles.length &&
      selectedArticles.length !== recordsPerPage && { articleId: selectedArticles.map(i => i.articleId) },
    {
      pageCheck: pageCheck
    },
    {
      allCheck: allCheck
    },
    {
      selectPageorAll:
        (pageCheck && currentPage) || (allCheck && 'A') ? (pageCheck && currentPage) || (allCheck && 'A') : 'A'
    },
    {
      page: currentPage
    },
    {
      pageLimit: allCheck && recordsPerPage
    },
    {
      recordsPerPage: recordsPerPage
    }
  ].filter(Boolean)

  const [clearAdvancedSearchField, setClearAdvancedSearchField] = useState(false)

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const shortCutFlags = useSelector(selectShortCutFlag)

  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  // Access priorityCompanyName from selectedClient
  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''

  const [loading, setLoading] = useState(true)

  // Fetch social feeds based on the provided API

  //user shortcut
  useEffect(() => {
    if (shortCutFlags) {
      setSelectedArticles([])

      const fetchArticlesApi = async () => {
        try {
          setLoading(true)
          const storedToken = localStorage.getItem('accessToken')

          if (storedToken) {
            // Format start and end dates
            const formatDateTimes = (date, setTime, isEnd) => {
              let formattedDate = date
              if (isEnd) {
                formattedDate = date.add(1, 'day')
              }
              const isoString = formattedDate.toISOString().slice(0, 10)
              const timeString = setTime ? (isEnd ? '23:59:59' : '12:00:00') : date.toISOString().slice(11, 19)

              return `${isoString} ${timeString}`
            }

            const formattedStartDate = selectedFromDate ? formatDateTimes(selectedFromDate, true, false) : null
            const formattedEndDate = selectedEndDate ? formatDateTimes(selectedEndDate, true, true) : null
            const selectedCompaniesString = selectedCompetitions.join(', ')

            const selectedMediaWithoutLastDigit = selectedMedia.map(item => {
              const lastChar = item.slice(-1)
              if (!isNaN(parseInt(lastChar))) {
                return item.slice(0, -1)
              }

              return item
            })
            const result = selectedMediaWithoutLastDigit.join(', ')

            const selectedTagString = selectedTag.join(', ')

            const selectedCitiesString = selectedCities.join(', ')

            const edition = selectedEditionType
              .map(i => {
                return i.editionTypeId
              })
              .join(', ')

            const publicationtype = selectedPublicationType
              .map(i => {
                return i.publicationTypeId
              })
              .join(', ')

            const selectedLanguagesString = selectedLanguages
              .map(i => {
                return i.id
              })
              .join(', ')

            const headers = {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedToken}`
            }

            const requestData = {
              clientId: clientId,
              screenName: 'printHeadlines',
              searchCriteria: {
                requestEntity: 'print',
                clientIds: clientId,
                companyIds: selectedCompaniesString,
                fromDate: formattedStartDate,
                toDate: formattedEndDate,
                page: currentPage,
                recordsPerPage: recordsPerPage,

                media: result,
                tags: selectedTagString,
                geography: selectedCitiesString,
                language: selectedLanguagesString,

                // Advanced search
                headline: searchParameters.searchHeadline,
                body: searchParameters.searchBody,
                journalist: searchParameters.journalist,
                wordCombo: searchParameters.combinationOfWords,
                anyWord: searchParameters.anyOfWords,
                ignoreWords: searchParameters.ignoreThis,
                phrase: searchParameters.exactPhrase,

                editionType: edition,
                sortby: selectedSortBy,

                publicationCategory: publicationtype
              }
            }

            const res = await axios.post(`${BASE_URL}/userConfigRequest`, requestData, { headers })
          }
        } catch (error) {
          console.error('Error fetching articles:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchArticlesApi()
    }
  }, [shortCutFlags])

  useEffect(() => {
    setSelectedArticles([])

    const fetchArticlesApi = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')

        if (storedToken) {
          // Format start and end dates
          const formatDateTimes = (date, setTime, isEnd) => {
            let formattedDate = date
            if (isEnd) {
              formattedDate = date.add(1, 'day')
            }
            const isoString = formattedDate.toISOString().slice(0, 10)
            const timeString = setTime ? (isEnd ? '23:59:59' : '12:00:00') : date.toISOString().slice(11, 19)

            return `${isoString} ${timeString}`
          }

          const formattedStartDate = selectedFromDate ? formatDateTimes(selectedFromDate, true, false) : null

          const formattedEndDate = selectedEndDate ? formatDateTimes(selectedEndDate, true, true) : null

          const selectedCompaniesString = selectedCompetitions.join(', ')

          const selectedMediaWithoutLastDigit = selectedMedia.map(item => {
            const lastChar = item.slice(-1)
            if (!isNaN(parseInt(lastChar))) {
              return item.slice(0, -1)
            }

            return item
          })

          const result = selectedMediaWithoutLastDigit.join(', ')

          const selectedTagString = selectedTag.join(', ')

          const selectedCitiesString = selectedCities.join(', ')

          const edition = selectedEditionType
            .map(i => {
              return i.editionTypeId
            })
            .join(', ')

          const publicationtype = selectedPublicationType
            .map(i => {
              return i.publicationTypeId
            })
            .join(', ')

          const selectedLanguagesString = selectedLanguages
            .map(i => {
              return i.id
            })
            .join(', ')

          // if(shortCutData)
          const response = await fetchArticles({
            clientIds: clientId,
            companyIds: selectedCompaniesString,
            fromDate: shortCutData?.searchCriteria?.fromDate || formattedStartDate,
            toDate: shortCutData?.searchCriteria?.toDate || formattedEndDate,
            page: currentPage,
            recordsPerPage: recordsPerPage,

            media: result,
            tags: shortCutData?.searchCriteria?.tags || selectedTagString,
            geography: selectedCitiesString,
            language: selectedLanguagesString,

            // Advanced search

            headline: searchParameters.searchHeadline,
            body: searchParameters.searchBody,
            journalist: searchParameters.journalist,
            wordCombo: searchParameters.combinationOfWords,
            anyWord: searchParameters.anyOfWords,
            ignoreWords: searchParameters.ignoreThis,
            phrase: searchParameters.exactPhrase,

            editionType: edition,
            sortby: selectedSortBy,

            publicationCategory: publicationtype
          })

          const totalRecords = response.totalRecords
          setArticles(response.articles)

          setPaginationModel(prevPagination => ({
            ...prevPagination,
            totalRecords
          }))
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
        setFetchTagsFlag(false)
      }
    }
    fetchArticlesApi()
  }, [
    selectedEndDate,
    selectedFromDate,
    currentPage,
    recordsPerPage,
    selectedCompetitions,
    selectedLanguages,
    clientId,
    selectedMedia,
    selectedTag,
    selectedCities,
    searchParameters,
    selectedEditionType,
    selectedPublicationType,
    selectedSortBy,
    fetchTagsFlag
  ])

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

  const handleEmail = () => {
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

  const [isPopupOpen, setPopupOpen] = useState(false)

  const handleRowClick = params => {
    setSelectedArticle(params.row)

    // currently hiding the click summary
    setPopupOpen(false)
  }

  useEffect(() => {
    if (pageCheck || allCheck) {
      setSelectedArticles([...articles])
    }
  }, [pageCheck, articles, allCheck])

  const handleSelect = article => {
    // Check if the article is already selected
    const isSelected = selectedArticles.some(selectedArticle => selectedArticle.articleId === article.articleId)

    // Update selectedArticles based on whether the article is already selected or not
    setSelectedArticles(prevSelectedArticles => {
      let updatedSelectedArticles = []
      if (isSelected) {
        // If article is already selected, remove it from the selection
        updatedSelectedArticles = prevSelectedArticles.filter(
          selectedArticle => selectedArticle.articleId !== article.articleId
        )
      } else {
        // If article is not selected, add it to the selection
        updatedSelectedArticles = [...prevSelectedArticles, article]
      }

      // Check if all articles on the page are selected or not
      const isPageFullySelected = articles.every(article =>
        updatedSelectedArticles.some(selectedArticle => selectedArticle.articleId === article.articleId)
      )

      // Update the page check state based on the page selection status
      setPageCheck(isPageFullySelected)

      return updatedSelectedArticles
    })
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

  const handleRecordsPerPageChange = value => {
    const newRecordsPerPage = parseInt(value, 10)

    if (!isNaN(newRecordsPerPage) && newRecordsPerPage > 0) {
      setRecordsPerPage(newRecordsPerPage)
      setCurrentPage(1) // Reset current page when changing records per page
    }
  }

  const handleReset = () => {
    setSelectedMedia([])
    setSelectedCities([])

    setSelectedTag([])
    setSelectedLanguages([])

    //ArticleListToolbar
    setSelectedEditionType([])
    setSelectedPublicationType([])
    setSelectedSortBy(null)
    setClearAdvancedSearchField(true)

    //selected Article
    setSelectedArticles([])
  }

  const handlePageCheckChange = event => {
    if (allCheck && event.target.checked) {
      setAllCheck(false)
      setPageCheck(true)
      setSelectedArticles([...articles])
    } else {
      setPageCheck(event.target.checked)
      setSelectedArticles(event.target.checked ? [...articles] : [])
    }
  }

  const handleAllCheckChange = event => {
    if (pageCheck && event.target.checked) {
      setPageCheck(false)
      setAllCheck(true)
      setSelectedArticles([...articles])
    } else {
      setAllCheck(event.target.checked)
      setSelectedArticles(event.target.checked ? [...articles] : [])
    }
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant='title-lg'>
            <Button onClick={handleReset}>{priorityCompanyName}</Button>
          </Typography>
        }
      />{' '}
      {/* Top Toolbar */}
      <ToolbarComponent
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        tags={tags}
        setTags={setTags}
        fetchTagsFlag={fetchTagsFlag}
      />{' '}
      {/* Toolbar with Date Filter */}
      <ArticleListToolbar
        setSearchQuery={setSearchQuery}
        isSearchBarVisible={isSearchBarVisible}
        toggleSearchBarVisibility={toggleSearchBarVisibility}
        handleDelete={handleDelete}
        handleEmail={handleEmail}
        handleRssFeed={handleRssFeed}
        openFilterPopover={openFilterPopover}
        handleFilter1D={handleFilter1D}
        handleFilter7D={handleFilter7D}
        handleFilter1M={handleFilter1M}
        filterPopoverAnchor={filterPopoverAnchor}
        closeFilterPopover={closeFilterPopover}
        selectedStartDate={selectedFromDate}
        selectedEndDate={selectedEndDate}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedArticles={selectedArticles}
        setSearchParameters={setSearchParameters}
        clearAdvancedSearchField={clearAdvancedSearchField}
        setClearAdvancedSearchField={setClearAdvancedSearchField}
        selectedEditionType={selectedEditionType}
        setSelectedEditionType={setSelectedEditionType}
        selectedPublicationType={selectedPublicationType}
        setSelectedPublicationType={setSelectedPublicationType}
        selectedSortBy={selectedSortBy}
        setSelectedSortBy={setSelectedSortBy}
        dataForExcelDump={dataForExcelDump}
        tags={tags}
        fetchTagsFlag={fetchTagsFlag}
        setFetchTagsFlag={setFetchTagsFlag}
        setDataFetchFlag={setDataFetchFlag}
        dataFetchFlag={dataFetchFlag}
        pageCheck={pageCheck}
        allCheck={allCheck}
      />
      {/* multiple selection */}
      {articles.length > 0 && (
        <Box pl={3}>
          <FormGroup sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'row' }}>
            <FormControlLabel
              control={<Checkbox checked={pageCheck} onChange={handlePageCheckChange} />}
              label='Page'
            />
            <FormControlLabel
              control={<Checkbox checked={allCheck} onChange={handleAllCheckChange} />}
              label='All Articles'
            />
          </FormGroup>
        </Box>
      )}
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

                  column.field !== 'select' &&
                    column.field !== 'edit' &&
                    !(column.field === 'date' && isNarrowMobileView)

                  return true
                })}
                pagination={false} // Remove pagination
                onRowClick={params => handleRowClick(params)}
                getRowId={getRowId}
                hideFooter
              />
            )}

            {articles.length > 0 && (
              <Pagination
                paginationModel={paginationModel}
                currentPage={currentPage}
                recordsPerPage={recordsPerPage}
                handleLeftPagination={handleLeftPagination}
                handleRightPagination={handleRightPagination}
                handleRecordsPerPageUpdate={handleRecordsPerPageChange}
              />
            )}
          </>
        )}
      </Box>
      {/* Popup Window */}
      <ArticleDialog open={isPopupOpen} handleClose={() => setPopupOpen(false)} article={selectedArticle} />{' '}
      {/* Render the FullScreenDialog component when open */}
      <FullScreenJPGDialog
        open={jpgDialogOpen}
        handleClose={handleJpgDialogClose}
        imageSrc={imageSrc}
        articles={selectedArticle}
      />
      {/* Render the FullScreenHTMLDialog component when open */}
      <FullScreenHTMLDialog
        open={htmlDialogOpen}
        handleClose={handleHtmlDialogClose}
        fileContent={fileContent}
        articles={selectedArticle}
      />
      {/* Render the FullScreenPDFDialog component when open */}
      <FullScreenPDFDialog
        open={pdfDialogOpen}
        handleClose={handlePdfDialogClose}
        pdfSrc={pdfSrc}
        articles={selectedArticle}
      />
      <FullScreenEditDetailsDialog
        open={editDetailsDialogOpen}
        handleClose={handleEditDetailsDialogClose}
        articles={selectedArticle}
        imageSrc={imageSrc}
        fetchTagsFlag={fetchTagsFlag}
        setFetchTagsFlag={setFetchTagsFlag}
      />
      <style css>{`
        .css-1p6gmy3-MuiDataGrid-root .MuiDataGrid-cell:not(.MuiDataGrid-cellCheckbox):first-of-type {
          padding-left: 0.8rem;
        }
      `}</style>
    </Card>
  )
}

export default TableSelection
