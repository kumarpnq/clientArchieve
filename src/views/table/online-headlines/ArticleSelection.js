// ** React Import
import { useState, useEffect } from 'react'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/system'
import { tooltipClasses } from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { FormControlLabel, FormGroup, List, ListItem, Menu, MenuItem } from '@mui/material'

import ToolbarComponent from './toolbar/ToolbarComponent'
import EditDialog from './dialog/EditDialog'
import ArticleListToolbar from './toolbar/ArticleListToolbar'

// ** Article Database

import useMediaQuery from '@mui/material/useMediaQuery'
import dayjs from 'dayjs'

import Pagination from './OnlineHeadlinePagination'

import CircularProgress from '@mui/material/CircularProgress'

// ** Redux
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate,
  selectShortCutFlag,
  selectShortCut
} from 'src/store/apps/user/userSlice'
import OptionsMenu from 'src/@core/components/option-menu'
import { BASE_URL } from 'src/api/base'
import { Icon } from '@iconify/react'
import SelectBox from 'src/@core/components/select'
import ArticleView from './dialog/article-view/view'
import Grid from './table-grid/Grid'

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

// ** Renders social feed column
const renderSocialFeed = params => {
  const { row } = params

  const formattedDate = dayjs(row.feedDate).format('DD-MM-YYYY')

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
    </List>
  )

  return (
    <CustomTooltip title={getTooltipContent(row)} arrow>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {row.headline}
        </Typography>
        <Typography noWrap variant='caption'>
          {row.publisher}
          <span style={{ marginLeft: '4px' }}>({formattedDate})</span>
        </Typography>
      </Box>
    </CustomTooltip>
  )
}

const TableSelection = () => {
  // * temp
  const [selectedItems, setSelectedItems] = useState([])
  const [openArticleView, setOpenArticleView] = useState(false)

  const publications = [
    { publicationName: 'The Hindu', publicationId: 'hindu' },
    { publicationName: 'The Muslim', publicationId: 'muslim' },
    { publicationName: 'The Christian', publicationId: 'christian' }
  ]

  const socialFeedColumns = [
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
          checked={selectedArticles.some(selectedArticle => selectedArticle.socialFeedId === params.row.socialFeedId)}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Grp',
      field: 'Grp',
      renderCell: params => (
        <SelectBox
          icon={<Icon icon='ion:add' />}
          iconButtonProps={{ sx: { color: publications.length ? 'primary.main' : 'primary' } }}
          renderItem='publicationName'
          renderKey='publicationId'
          menuItems={publications}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )
    },
    {
      flex: 0.6,
      minWidth: 240,
      field: 'socialFeed',
      headerName: 'Social Feed',
      renderCell: renderSocialFeed
    },

    {
      flex: 0.1,
      minWidth: 5,
      field: 'edit',
      headerName: 'Edit',
      renderCell: params => (
        <OptionsMenu
          iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
          options={[
            {
              text: 'Edit Detail',
              menuItemProps: {
                onClick: () => {
                  handleEdit(params.row)
                }
              }
            },
            {
              text: 'View',
              menuItemProps: {
                onClick: () => {
                  handleView(params.row)
                }
              }
            },
            {
              text: 'Article View',
              menuItemProps: {
                onClick: () => {
                  setSelectedArticle(params.row)
                  setOpenArticleView(true)
                }
              }
            }
          ]}
        />
      )
    }
  ]

  const isNotResponsive = useMediaQuery('(min-width: 1100px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNarrowMobileView = useMediaQuery('(max-width: 405px)')

  // ** State
  const [selectedArticles, setSelectedArticles] = useState([])
  const [socialFeeds, setSocialFeeds] = useState([])
  const [tags, setTags] = useState([])
  const [fetchTagsFlag, setFetchTagsFlag] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 0, // Default pageSize
    totalRecords: 0 // New state for totalRecords
  })

  const [searchParameters, setSearchParameters] = useState({
    searchHeadline: '',
    searchBody: '',
    combinationOfWords: '',
    anyOfWords: '',
    exactPhrase: '',
    ignoreThis: ''
  })

  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)
  const selectedClient = useSelector(selectSelectedClient)
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const shortCutFlags = useSelector(selectShortCutFlag)
  const shortCutData = useSelector(selectShortCut)

  const clientId = selectedClient ? selectedClient.clientId : null

  // Access priorityCompanyName from selectedClient
  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const getRowId = row => row.socialFeedId

  const [selectedGeography, setSelectedGeography] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState([])
  const [selectedMedia, setSelectedMedia] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedSortBy, setSelectedSortBy] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(100)
  const [loading, setLoading] = useState(false)
  const [pageCheck, setPageCheck] = useState(false)
  const [allCheck, setAllCheck] = useState(false)
  const [dataFetchFlag, setDataFetchFlag] = useState(false)
  const [selectedEditionType, setSelectedEditionType] = useState([])
  const [selectedPublicationType, setSelectedPublicationType] = useState([])

  const edition = selectedEditionType?.map(i => {
    return i.editionTypeId
  })

  const publicationtype = selectedPublicationType.map(i => {
    return i.publicationTypeId
  })

  const dataForDump = [
    selectedGeography.length && { geography: selectedGeography },
    selectedMedia.length && { media: selectedMedia },
    selectedTags.length && { tags: selectedTags },
    selectedLanguage.length && {
      language: selectedLanguage.map(i => {
        return i.id
      })
    },
    selectedEditionType && { editionType: edition },
    selectedPublicationType && { publicationCategory: publicationtype },

    searchParameters.searchHeadline && { headline: searchParameters.searchHeadline },
    searchParameters.searchBody && { body: searchParameters.searchBody },
    searchParameters.journalist && { journalist: searchParameters.journalist },
    searchParameters.combinationOfWords && { wordCombo: searchParameters.combinationOfWords },
    searchParameters.anyOfWords && { anyWord: searchParameters.anyOfWords },
    searchParameters.ignoreThis && { ignoreWords: searchParameters.ignoreThis },
    searchParameters.exactPhrase && { phrase: searchParameters.exactPhrase },
    selectedArticles.length &&
      selectedArticles.length !== recordsPerPage && { articleId: selectedArticles.map(i => i.socialFeedId) },

    {
      pageCheck: pageCheck
    },
    {
      allCheck: allCheck
    },
    {
      // selectPageorAll: (pageCheck && currentPage) || 'P'
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

    // allCheck && { totalRecords: +allCheck }
  ].filter(Boolean)

  const handleEdit = row => {
    setSelectedArticle(row)
    setIsEditDialogOpen(true)
  }

  const handleView = row => {
    window.open(row.socialFeedlink, '_blank')
  }

  //user shortcut
  useEffect(() => {
    setSelectedArticles([])
    if (shortCutFlags) {
      const fetchArticlesApi = async () => {
        try {
          setLoading(true)
          const storedToken = localStorage.getItem('accessToken')

          if (storedToken) {
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

            const selectedTagString = selectedTags.join(', ')

            const selectedCitiesString = selectedGeography.join(', ')

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

            const selectedLanguagesString = selectedLanguage
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
              screenName: 'onlineHeadlines',
              searchCriteria: {
                requestEntity: 'online',
                clientIds: clientId,
                companyIds: selectedCompaniesString,
                fromDate: formattedStartDate,
                toDate: formattedEndDate,
                page: currentPage,
                recordsPerPage: recordsPerPage,

                // media: result,
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
    const fetchSocialFeeds = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const base_url = process.env.NEXT_PUBLIC_BASE_URL

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

          const selectedTagString = selectedTags.join(', ')
          const selectedCitiesString = selectedGeography.join(', ')

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

          const selectedLanguagesString = selectedLanguage
            .map(i => {
              return i.id
            })
            .join(', ')

          const request_params = {
            clientIds: clientId,
            companyIds: selectedCompaniesString,
            fromDate: shortCutData?.searchCriteria?.fromDate || formattedStartDate,
            toDate: shortCutData?.searchCriteria?.toDate || formattedEndDate,
            page: currentPage,
            recordsPerPage: recordsPerPage,

            geography: selectedCitiesString,
            media: selectedMedia,
            tags: shortCutData?.searchCriteria?.tags || selectedTagString,
            language: selectedLanguagesString,

            // Advanced search
            headline: searchParameters.searchHeadline,
            body: searchParameters.searchBody,
            wordCombo: searchParameters.combinationOfWords,
            anyWord: searchParameters.anyOfWords,
            ignoreWords: searchParameters.ignoreThis,
            phrase: searchParameters.exactPhrase,

            // sort by
            sortby: selectedSortBy,
            editionType: edition,
            publicationCategory: publicationtype
          }

          const response = await axios.get(`${base_url}/clientWiseSocialFeeds/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: request_params
          })

          const totalRecords = response.data.totalRecords || 0

          setSocialFeeds(response.data.socialFeeds)

          // Update totalRecords in the state
          setPaginationModel(prevPagination => ({
            ...prevPagination,
            totalRecords
          }))
        }
      } catch (error) {
        console.error('Error fetching social feeds:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSocialFeeds()
  }, [
    clientId,
    selectedCompetitions,
    selectedEndDate,
    selectedFromDate,
    currentPage,
    recordsPerPage,
    selectedGeography,
    selectedLanguage,
    selectedMedia,
    selectedTags,
    searchParameters,
    selectedSortBy,
    dataFetchFlag,
    selectedEditionType,
    selectedPublicationType
  ])

  // Divide social feeds into left and right columns
  const leftSocialFeeds = socialFeeds.filter((_, index) => index % 2 === 0)
  const rightSocialFeeds = socialFeeds.filter((_, index) => index % 2 !== 0)

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

  const [selectedArticle, setSelectedArticle] = useState(null)

  const handleRowClick = params => {
    setSelectedArticle(params.row)
  }

  useEffect(() => {
    if (pageCheck || allCheck) {
      setSelectedArticles([...socialFeeds])
    }
  }, [pageCheck, socialFeeds, allCheck])

  const handleSelect = article => {
    const isSelected = selectedArticles.some(selectedArticle => selectedArticle.socialFeedId === article.socialFeedId)

    setSelectedArticles(prevSelectedArticles => {
      let updatedSelectedArticles
      if (isSelected) {
        updatedSelectedArticles = prevSelectedArticles.filter(
          selectedArticle => selectedArticle.socialFeedId !== article.socialFeedId
        )
      } else {
        updatedSelectedArticles = [...prevSelectedArticles, article]
      }

      const isPageFullySelected = socialFeeds.every(article =>
        updatedSelectedArticles.some(selectedArticle => selectedArticle.socialFeedId === article.articleId)
      )

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

  const handleResetValues = () => {
    // setSelectedCompanyId([])
    setSelectedGeography([])
    setSelectedLanguage([])
    setSelectedMedia('')
    setSelectedTags([])
    setSearchParameters({
      searchHeadline: '',
      searchBody: '',
      combinationOfWords: '',
      anyOfWords: '',
      exactPhrase: '',
      ignoreThis: ''
    })
    setCurrentPage(1)
    setSelectedSortBy(null)
  }

  const handlePageCheckChange = event => {
    if (allCheck && event.target.checked) {
      setAllCheck(false)
      setPageCheck(true)
      setSelectedArticles([...socialFeeds])
    } else {
      setPageCheck(event.target.checked)
      setSelectedArticles(event.target.checked ? [...socialFeeds] : [])
    }
  }

  const handleAllCheckChange = event => {
    if (pageCheck && event.target.checked) {
      setPageCheck(false)
      setAllCheck(true)
      setSelectedArticles([...socialFeeds])
    } else {
      setAllCheck(event.target.checked)
      setSelectedArticles(event.target.checked ? [...socialFeeds] : [])
    }
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant='title-lg' sx={{ cursor: 'pointer', color: 'primary' }}>
            <Button onClick={handleResetValues}>{priorityCompanyName}</Button>
          </Typography>
        }
      />
      {/* Top Toolbar */}
      <ToolbarComponent
        selectedGeography={selectedGeography}
        setSelectedGeography={setSelectedGeography}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setSelectedMedia={setSelectedMedia}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tags={tags}
        setTags={setTags}
        fetchTagsFlag={fetchTagsFlag}
      />
      {/* Toolbar with Date Filter */}
      <ArticleListToolbar
        setSearchQuery={setSearchQuery}
        isSearchBarVisible={isSearchBarVisible}
        toggleSearchBarVisibility={toggleSearchBarVisibility}
        setSelectedEditionType={setSelectedEditionType}
        selectedPublicationType={selectedPublicationType}
        openFilterPopover={openFilterPopover}
        filterPopoverAnchor={filterPopoverAnchor}
        closeFilterPopover={closeFilterPopover}
        dataForDump={dataForDump}
        setSearchParameters={setSearchParameters}
        selectedArticles={selectedArticles}
        tags={tags}
        fetchTagsFlag={fetchTagsFlag}
        setFetchTagsFlag={setFetchTagsFlag}
        setSelectedSortBy={setSelectedSortBy}
        selectedSortBy={selectedSortBy}
        selectedStartDate={selectedFromDate}
        selectedEndDate={selectedEndDate}
        setTags={setTags}
        setDataFetchFlag={setDataFetchFlag}
        dataFetchFlag={dataFetchFlag}
        setSelectedPublicationType={setSelectedPublicationType}
        pageCheck={pageCheck}
        allCheck={allCheck}
      />
      {/* multiple selection */}
      {socialFeeds.length > 0 && (
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
      <Grid
        loading={loading}
        leftSocialFeeds={leftSocialFeeds}
        rightSocialFeeds={rightSocialFeeds}
        socialFeeds={socialFeeds}
        getRowId={getRowId}
        handleSelect={handleSelect}
        handleEdit={handleEdit}
        handleView={handleView}
        setSelectedArticle={setSelectedArticle}
        setOpenArticleView={setOpenArticleView}
        selectedArticles={selectedArticles}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        renderSocialFeed={renderSocialFeed}
        paginationModel={paginationModel}
        currentPage={currentPage}
        recordsPerPage={recordsPerPage}
        handleLeftPagination={handleLeftPagination}
        handleRightPagination={handleRightPagination}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        handleRowClick={handleRowClick}
      />

      <EditDialog
        fetchTagsFlag={fetchTagsFlag}
        handleClose={() => setIsEditDialogOpen(false)}
        setFetchTagsFlag={setFetchTagsFlag}
        open={isEditDialogOpen}
        socialFeed={selectedArticle}
      />
      <ArticleView
        open={openArticleView}
        setOpen={setOpenArticleView}
        article={selectedArticle}
        setArticle={setSelectedArticle}
      />
    </Card>
  )
}

export default TableSelection
