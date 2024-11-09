// ** React Import
import { useState, useEffect } from 'react'
import axios from 'axios'

// ** MUI Imports

import { styled } from '@mui/system'
import { tooltipClasses } from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { FormControlLabel, FormGroup, List, ListItem, Tooltip, Checkbox, Typography, Card, Box } from '@mui/material'

import ToolbarComponent from './toolbar/ToolbarComponent'
import EditDialog from './dialog/EditDialog'
import ArticleListToolbar from './toolbar/ArticleListToolbar'

// ** Article Database
import dayjs from 'dayjs'

// ** Redux
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate,
  selectShortCutFlag,
  selectShortCut,
  selectedDateType
} from 'src/store/apps/user/userSlice'

import { BASE_URL, ELASTIC_SERVER } from 'src/api/base'

import ArticleView from './dialog/article-view/view'
import Grid from './table-grid/Grid'

import Pagination from './OnlineHeadlinePagination'
import ResetOnlineFields from './reset/ResetOnlineFields'

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

const TableSelection = () => {
  // * temp
  const [selectedItems, setSelectedItems] = useState([])
  const [openArticleView, setOpenArticleView] = useState(false)

  // ** State
  const [selectedArticles, setSelectedArticles] = useState([])
  const [socialFeeds, setSocialFeeds] = useState([])
  const [tags, setTags] = useState([])
  const [fetchTagsFlag, setFetchTagsFlag] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 0,
    totalRecords: 0
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
  const selectedTypeOfDate = useSelector(selectedDateType)

  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const shortCutFlags = useSelector(selectShortCutFlag)
  const shortCutData = useSelector(selectShortCut)

  const clientId = selectedClient ? selectedClient.clientId : null
  const clientName = selectedClient ? selectedClient.clientName : null

  // Access priorityCompanyName from selectedClient
  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [selectedGeography, setSelectedGeography] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedSortBy, setSelectedSortBy] = useState('date')
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

  const selectedMediaWithoutLastDigit = selectedMedia.map(item => {
    const lastChar = item.slice(-1)
    if (!isNaN(parseInt(lastChar))) {
      return item.slice(0, -1)
    }

    return item
  })
  const result = selectedMediaWithoutLastDigit.join(', ')

  const dataForDump = [
    selectedGeography.length && { geography: selectedGeography },
    selectedMedia.length && { media: result },
    selectedTags.length && { tags: selectedTags },
    selectedLanguage.length && {
      language: selectedLanguage.map(i => {
        return i.id
      })
    },
    selectedEditionType && { editionType: edition },
    selectedSortBy && { sortby: selectedSortBy },
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
              displayName: 'Online News',
              clientName,
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
    setSelectedArticles([])
    setSocialFeeds([])

    const controller = new AbortController()
    const { signal } = controller

    const fetchSocialFeeds = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const selectedMediaWithoutLastDigit = selectedMedia.map(item => {
            const lastChar = item.slice(-1)
            if (!isNaN(parseInt(lastChar))) {
              return item.slice(0, -1)
            }

            return item
          })

          const result = selectedMediaWithoutLastDigit.join(', ')

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

          const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null

          const formattedToDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

          const request_params = {
            clientIds: clientId,
            companyIds: selectedCompetitions,

            // DateType:'articleInfo.articleDate',
            DateTye: selectedTypeOfDate === 'AD' ? 'ARTICLE_DATE' : 'CREATED_DATE',
            fromDate: shortCutData?.searchCriteria?.fromDate || formattedFromDate,
            toDate: shortCutData?.searchCriteria?.toDate || formattedToDate,
            page: currentPage,
            recordsPerPage: recordsPerPage,

            geography: selectedCitiesString,
            media: result,
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

            // editionType: edition,
            publicationCategory: publicationtype
          }

          const response = await axios.get(`${ELASTIC_SERVER}/api/v1/client/getSocialFeed`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: request_params,
            paramsSerializer: params => {
              const str = []
              for (const key in params) {
                if (Array.isArray(params[key])) {
                  params[key].forEach(val => {
                    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
                  })
                } else if (params[key] !== null && params[key] !== undefined) {
                  str.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                }
              }

              return str.join('&')
            },
            signal
          })
          const socialFeedData = (await response.data.data.doc.length) ? response.data.data.doc : []

          const transformedArray = socialFeedData.map(item => {
            const { socialFeedId, feedInfo, feedData, uploadInfo, publicationInfo, companyTag, children } = item._source

            return {
              socialFeedId: socialFeedId,
              headline: feedData.headlines,
              summary: feedData.summary,
              publisher: publicationInfo.name,
              socialFeedlink: feedInfo?.link,
              feedDate: `${feedData.feedDate}`,
              articleUploadId: uploadInfo?.uploadId,
              socialFeedAuthorName: '',
              companies:
                item.fields?.company?.map(company => ({
                  id: company.id,
                  name: company.name,
                  tags:
                    company?.clientArticleTag?.map(tag => ({
                      clientId: tag?.clientId,
                      tags: tag?.tags || []
                    })) || []
                })) || [],
              clientId: '',
              clientName: '',
              children: children || []
            }
          })

          const totalRecords = response.data.data.count || 0

          setSocialFeeds(transformedArray)

          // Update totalRecords in the state
          setPaginationModel(prevPagination => ({
            ...prevPagination,
            totalRecords
          }))
        }
      } catch (error) {
        console.error('Error fetching social feeds:', error)
        setSocialFeeds([])
      } finally {
        setLoading(false)
      }
    }
    fetchSocialFeeds()

    return () => controller.abort()
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
    selectedPublicationType,
    selectedTypeOfDate,
    shortCutData?.searchCriteria?.fromDate,
    shortCutData?.searchCriteria?.tags,
    shortCutData?.searchCriteria?.toDate
  ])

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

  useEffect(() => {
    if (pageCheck || allCheck) {
      setSelectedArticles([...socialFeeds])
    }
  }, [pageCheck, socialFeeds, allCheck])

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
      setCurrentPage(1)
    }
  }

  const handleResetValues = () => {
    setSelectedCompanyId([])
    setSelectedGeography([])
    setSelectedLanguage([])
    setSelectedMedia([])
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
      <Typography
        sx={{
          cursor: 'pointer',
          color: 'primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Button onClick={handleResetValues}>{priorityCompanyName}</Button>
        <ResetOnlineFields
          setSelectedGeography={setSelectedGeography}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedMedia={setSelectedMedia}
          setSelectedTags={setSelectedTags}
          setSelectedArticles={setSelectedArticles}
          setSocialFeeds={setSocialFeeds}
        />
      </Typography>
      {/* Top Toolbar */}
      <ToolbarComponent
        selectedGeography={selectedGeography}
        setSelectedGeography={setSelectedGeography}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setSelectedMedia={setSelectedMedia}
        selectedMedia={selectedMedia}
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
        setSelectedArticles={setSelectedArticles}
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {socialFeeds.length > 0 && (
          <Pagination
            paginationModel={paginationModel}
            currentPage={currentPage}
            recordsPerPage={recordsPerPage}
            handleLeftPagination={handleLeftPagination}
            handleRightPagination={handleRightPagination}
            handleRecordsPerPageUpdate={handleRecordsPerPageChange}
          />
        )}

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
      </Box>

      {/* DataGrid */}
      <Grid
        loading={loading}
        socialFeeds={socialFeeds}
        handleEdit={handleEdit}
        handleView={handleView}
        setSelectedArticle={setSelectedArticle}
        setOpenArticleView={setOpenArticleView}
        selectedArticles={selectedArticles}
        setSelectedArticles={setSelectedArticles}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
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
