// ** React Import
import { useState, useEffect } from 'react'
import { BASE_URL, ELASTIC_SERVER } from 'src/api/base'
import axios from 'axios'
import { FixedSizeList as List } from 'react-window'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { FormControlLabel, FormGroup, ListItem } from '@mui/material'
import ToolbarComponent from './toolbar/ToolbarComponent'
import ArticleDialog from './dialog/ArticleDialog'
import ArticleListToolbar from './toolbar/ArticleListToolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import dayjs from 'dayjs'

//pagination
import Pagination from './PrintOnlinePagination.js'
import CircularProgress from '@mui/material/CircularProgress'

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

// ** Tooltip
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/system'

import { tooltipClasses } from '@mui/material/Tooltip'
import OptionsMenu from 'src/@core/components/option-menu'
import useFetchReadArticleFile from 'src/api/global/useFetchReadArticleFile'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import Grid from './data-grid/Grid'

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      fontSize: 11,
      maxWidth: '300px',
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.default
      }
    }
  })
)

const TableSelection = () => {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedSortBy, setSelectedSortBy] = useState(null)

  const handleView = row => {
    window.open(row.socialFeedlink, '_blank')
  }

  // ** Renders social feed column
  const renderArticle = params => {
    const { row } = params

    const formattedDate = dayjs(row.articleDate).format('DD-MM-YYYY')

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
        <ListItem></ListItem>
        <ListItem>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
            Companies :{' '}
            <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
              {row.companies.length > 1
                ? row.companies?.map(company => company.name).join(', ')
                : row.companies[0]?.name}
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

  // * temp
  const [selectedItems, setSelectedItems] = useState([])

  // ** State
  const [articles, setArticles] = useState([])

  const [selectedArticles, setSelectedArticles] = useState([])
  const [tags, setTags] = useState([])
  const [fetchTagsFlag, setFetchTagsFlag] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 0, // Default pageSize
    totalRecords: 0 // New state for totalRecords
  })

  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedGeography, setSelectedGeography] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])

  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(100)
  const [pageCheck, setPageCheck] = useState(false)
  const [allCheck, setAllCheck] = useState(false)
  const [dataFetchFlag, setDataFetchFlag] = useState(false)
  const [selectedEditionType, setSelectedEditionType] = useState([])
  const [selectedPublicationType, setSelectedPublicationType] = useState([])

  const [searchParameters, setSearchParameters] = useState({
    searchHeadline: '',
    searchBody: '',
    combinationOfWords: '',
    anyOfWords: '',
    exactPhrase: '',
    ignoreThis: '',
    journalist: ''
  })

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedTypeOfDate = useSelector(selectedDateType)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const shortCutFlags = useSelector(selectShortCutFlag)
  const shortCutData = useSelector(selectShortCut)

  // Access priorityCompanyName from selectedClient
  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''

  const edition = selectedEditionType?.map(i => {
    return i.editionTypeId
  })

  const publicationtype = selectedPublicationType?.map(i => {
    return i.publicationTypeId
  })

  const dataForDump = [
    selectedGeography.length && { geography: selectedGeography },
    selectedMedia.length && { media: selectedMedia },
    selectedTags.length && { tags: selectedTags },
    selectedLanguages.length && {
      language: selectedLanguages.map(i => {
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
      selectedArticles.length !== recordsPerPage && {
        articleId: selectedArticles.map(i => ({ articleId: i.articleId, articleType: i.articleType }))
      },
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

    // allCheck && { totalRecords: +allCheck }
  ].filter(Boolean)

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
              screenName: 'bothHeadlines',
              searchCriteria: {
                requestEntity: 'both',
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

  // Fetch social feeds based on the provided API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')

        if (storedToken) {
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

          const selectedLanguagesString = selectedLanguages
            .map(i => {
              return i.id
            })
            .join(', ')

          // * format date functions
          // const formattedStartDateForPrint = selectedFromDate
          //   ? dayjs(selectedFromDate).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
          //   : null

          // const formattedEndDateForPrint = selectedEndDate
          //   ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss')
          //   : null

          const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null

          const formattedToDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

          const request_params = {
            // clientIds: clientId,

            // clientIds: [clientId],

            companyIds: selectedCompetitions,

            // dateType: selectedTypeOfDate,
            fromDate: shortCutData?.searchCriteria?.fromDate || formattedFromDate,
            toDate: shortCutData?.searchCriteria?.toDate || formattedToDate,

            // printFromDate: formattedStartDateForPrint,
            // printToDate: formattedEndDateForPrint,
            // onlineFromDate: formattedStartDateForOnline,
            // onlineToDate: formattedEndDateOnline,
            page: currentPage,
            recordsPerPage: recordsPerPage,
            sortby: selectedSortBy,
            editionType: edition,
            publicationCategory: publicationtype,

            geography: selectedCitiesString,
            language: selectedLanguagesString,
            media: selectedMedia.join(','),
            tags: shortCutData?.searchCriteria?.tags || selectedTagString
          }

          // const response = await axios.get(`${BASE_URL}/clientWiseSocialFeedAndArticles/`,
          const response = await axios.get(
            `${ELASTIC_SERVER}/api/v1/client/getOnlineAndprintArticle`,

            {
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
              }
            }
          )

          const totalRecords = response.data.data.doc.length

          const transformedArray = response.data.data.doc.map(item => {
            const { articleId, articleInfo, articleData, uploadInfo, publicationInfo, companyTag } = item._source

            return {
              articleId: articleId,
              headline: articleData?.headlines,
              summary: articleData?.summary,
              publication: publicationInfo?.name,
              publicationId: publicationInfo?.id,
              articleDate: `${articleInfo?.articleDate}T00:00:00`,
              articleUploadId: uploadInfo?.uploadId,
              articleJournalist: '',
              companies:
                companyTag?.map(company => ({
                  id: company.id,
                  name: company.name
                })) || [],
              clientId: '',
              clientName: '',
              editionType: '',
              editionTypeName: '',
              publicationCategory: '',
              circulation: 0,
              publicationType: '',
              language: articleData?.language,
              size: articleData?.space,
              pageNumber: articleData?.pageNumber,
              children: [],
              link: '',
              articleType: 'print'
            }
          })

          setArticles(transformedArray)

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
    fetchArticles()
  }, [
    selectedEndDate,
    selectedFromDate,
    currentPage,
    recordsPerPage,
    selectedCompetitions,
    selectedGeography,
    selectedLanguages,
    selectedMedia,
    selectedTags,
    clientId,
    dataFetchFlag,
    selectedSortBy,
    selectedEditionType,
    selectedPublicationType,
    selectedTypeOfDate,
    shortCutData?.searchCriteria?.fromDate,
    shortCutData?.searchCriteria?.toDate,
    shortCutData?.searchCriteria?.tags
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
    setPopupOpen(false)
  }

  useEffect(() => {
    if (pageCheck || allCheck) {
      setSelectedArticles([...articles])
    }
  }, [pageCheck, articles, allCheck])

  const handleSelect = article => {
    const isSelected = selectedArticles.some(selectedArticle => selectedArticle.articleId === article.articleId)
    setSelectedArticles(prevSelectedArticles => {
      let updatedSelectedArticles = []
      if (isSelected) {
        updatedSelectedArticles = prevSelectedArticles.filter(
          selectedArticle => selectedArticle.articleId !== article.articleId
        )
      } else {
        updatedSelectedArticles = [...prevSelectedArticles, article]
      }

      const isPageFullySelected = articles.every(article =>
        updatedSelectedArticles.some(selectedArticle => selectedArticle.articleId === article.articleId)
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
      setCurrentPage(1)
    }
  }

  const handleReset = () => {
    setSelectedGeography([])
    setSelectedLanguages([])
    setSelectedMedia('')
    setSelectedTags([])
    setSelectedSortBy(null)
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
          <Typography variant='title-lg' sx={{ cursor: 'pointer' }}>
            {' '}
            <Button onClick={handleReset}>{priorityCompanyName}</Button>
          </Typography>
        }
      />
      {/* Top Toolbar */}
      <ToolbarComponent
        selectedGeography={selectedGeography}
        setSelectedGeography={setSelectedGeography}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        selectedTag={selectedTags}
        setSelectedTag={setSelectedTags}
        tags={tags}
        setTags={setTags}
        fetchTagsFlag={fetchTagsFlag}
      />
      {/* Toolbar with Date Filter */}
      <ArticleListToolbar
        setSelectedEditionType={setSelectedEditionType}
        selectedPublicationType={selectedPublicationType}
        setSearchQuery={setSearchQuery}
        isSearchBarVisible={isSearchBarVisible}
        setSelectedSortBy={setSelectedSortBy}
        selectedSortBy={selectedSortBy}
        toggleSearchBarVisibility={toggleSearchBarVisibility}
        openFilterPopover={openFilterPopover}
        handleFilter1D={handleFilter1D}
        handleFilter7D={handleFilter7D}
        handleFilter1M={handleFilter1M}
        filterPopoverAnchor={filterPopoverAnchor}
        closeFilterPopover={closeFilterPopover}
        selectedStartDate={selectedFromDate}
        selectedEndDate={selectedEndDate}
        setSearchParameters={setSearchParameters}
        selectedArticles={selectedArticles}
        tags={tags}
        fetchTagsFlag={fetchTagsFlag}
        setFetchTagsFlag={setFetchTagsFlag}
        dataForDump={dataForDump}
        dataFetchFlag={dataFetchFlag}
        setDataFetchFlag={setDataFetchFlag}
        setSelectedPublicationType={setSelectedPublicationType}
        pageCheck={pageCheck}
        allCheck={allCheck}
      />
      {/* multiple selection */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      </Box>
      {/* DataGrid */}
      <Grid
        articles={articles}
        selectedArticles={selectedArticles}
        loading={loading}
        setSelectedArticles={setSelectedArticles}
      />
      {/* Popup Window */}
      <ArticleDialog open={isPopupOpen} handleClose={() => setPopupOpen(false)} article={selectedArticle} />{' '}
    </Card>
  )
}

export default TableSelection
