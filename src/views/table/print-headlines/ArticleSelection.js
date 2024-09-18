// ** React Importu
import React, { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import ToolbarComponent from './toolbar/ToolbarComponent'
import ArticleDialog from './dialog/ArticleDialog'
import ArticleListToolbar from './toolbar/ArticleListToolbar'
import Button from '@mui/material/Button'
import { FormControlLabel, FormGroup } from '@mui/material'

// ** MUI icons
import dayjs from 'dayjs'

//api call
import { fetchArticles } from '../../../api/print-headlines/articleApi'

// ** Redux
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate,
  selectShortCutFlag,
  selectShortCut,
  setShotCutPrint,
  selectedDateType
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
import { BASE_URL } from 'src/api/base'
import axios from 'axios'
import TableGrid from './table-grid/TableGrid'

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

const renderArticle = React.memo(params => {
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
        {row.publication}
        <span style={{ marginLeft: '4px' }}>({formattedDate})</span>
      </Typography>
    </Box>
  )
})

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
  const [articleOptimizedObj, setArticleOptimizedObj] = useState({})
  const [articles, setArticles] = useState([])

  const [fetchTags, setFetchTags] = useState(0)

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

  // ** State

  const [tags, setTags] = useState([])
  const [fetchTagsFlag, setFetchTagsFlag] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 0, // Default pageSize
    totalRecords: 0 // New state for totalRecords
  })
  const [selectedFilter, setSelectedFilter] = useState('1D')

  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)

  const getRowId = row => row.articleId
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(50)

  const shortCutData = useSelector(selectShortCut)

  const [selectedMedia, setSelectedMedia] = useState([])

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

  // console.log('checkingpages==>', pageCheck, 'articleselect==>', selectedArticles, 'allcheck==>', selectedMedia)

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
    selectedArticles?.length &&
      selectedArticles?.length !== recordsPerPage && { articleId: selectedArticles?.map(i => i?.articleId) },
    {
      pageCheck: pageCheck
    },
    {
      allCheck: allCheck
    },
    {
      selectPageorAll:
        (pageCheck && currentPage) || (allCheck && 'A') ? (pageCheck && currentPage) || (allCheck && 'A') : false
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

  const selectedClient = useSelector(selectSelectedClient)
  const shortCutFlags = useSelector(selectShortCutFlag)

  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedCompetitions = useSelector(selectSelectedCompetitions)

  const selectedTypeOfDate = useSelector(selectedDateType)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''

  const [loading, setLoading] = useState(true)

  //user shortcut
  useEffect(() => {
    setSelectedArticles([])

    if (shortCutFlags) {
      const fetchArticlesApi = async () => {
        try {
          setLoading(true)
          const storedToken = localStorage.getItem('accessToken')

          if (storedToken) {
            const selectedCompaniesString = selectedCompetitions.join(', ')

            const formattedStartDate = selectedFromDate
              ? dayjs(selectedFromDate).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
              : null

            const formattedEndDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

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
              screenName: 'printHeadlines',
              displayName: 'Print News',
              clientName,
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

        const formattedStartDate = selectedFromDate
          ? dayjs(selectedFromDate).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : null

        const formattedEndDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

        if (storedToken) {
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

            dateType: selectedTypeOfDate,
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

          let obj = {}
          response.articles.map(item => {
            obj[item?.articleId] = item
          })
          setArticleOptimizedObj(obj)

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
    fetchTagsFlag,
    selectedTypeOfDate
  ])

  // Divide social feeds into left and right columns
  // const leftArticles = articles.filter((_, index) => index % 2 === 0)
  // const rightArticles = articles.filter((_, index) => index % 2 !== 0)

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

  const [isPopupOpen, setPopupOpen] = useState(false)

  const handleRowCheck = (tablePosition, params) => {
    if (tablePosition === 'center') {
      localStorage.setItem('selectedRows', JSON.stringify(params))
    }
    if (tablePosition == 'left') {
      localStorage.setItem('leftSelectedRows', JSON.stringify(params))
    }

    if (tablePosition == 'right') {
      localStorage.setItem('rightSelectedRows', JSON.stringify(params))
    }

    if (tablePosition === 'left' || tablePosition === 'right') {
      const prevLeft = JSON.parse(localStorage.getItem('leftSelectedRows'))
      const prevRight = JSON.parse(localStorage.getItem('rightSelectedRows'))
      let finalArr = []
      if (prevLeft?.length > 0) {
        finalArr.push(...prevLeft)
      }
      if (prevRight?.length > 0) {
        finalArr.push(...prevRight)
      }
      localStorage.setItem('selectedRows', JSON.stringify(finalArr))
    }

    setTimeout(() => {
      const params = JSON.parse(localStorage.getItem('selectedRows'))
      let arr = []
      params?.map(itm => {
        arr.push(articleOptimizedObj[itm])
      })
      setSelectedArticles(arr)
    }, 2000)
  }

  const handlePageCheckChange = event => {
    if (allCheck && event.target.checked) {
      setAllCheck(false)
      setPageCheck(true)
      setSelectedArticles([...articles])
    } else {
      setPageCheck(event.target.checked)
      setSelectedArticles(event.target.checked ? [...articles] : [])
      localStorage.setItem('selectedRows', JSON.stringify([]))
      localStorage.setItem('rightSelectedRows', JSON.stringify([]))
      localStorage.setItem('leftSelectedRows', JSON.stringify([]))
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
      localStorage.setItem('selectedRows', JSON.stringify([]))
      localStorage.setItem('rightSelectedRows', JSON.stringify([]))
      localStorage.setItem('leftSelectedRows', JSON.stringify([]))
    }
  }

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
    setSelectedMedia([])
    setSelectedCities([])

    setSelectedTag([])
    setSelectedLanguages([])

    setSelectedEditionType([])
    setSelectedPublicationType([])
    setSelectedSortBy(null)
    setClearAdvancedSearchField(true)

    setSelectedArticles([])
  }

  const SelectAllModal = () => {
    return (
      <>
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
      </>
    )
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
        fetchTags={fetchTags}
      />{' '}
      {/* Toolbar with Date Filter */}
      <ArticleListToolbar
        setSearchQuery={setSearchQuery}
        isSearchBarVisible={isSearchBarVisible}
        toggleSearchBarVisibility={toggleSearchBarVisibility}
        filterPopoverAnchor={filterPopoverAnchor}
        closeFilterPopover={closeFilterPopover}
        selectedStartDate={selectedFromDate}
        selectedEndDate={selectedEndDate}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedArticles={selectedArticles}
        setSelectedArticles={setSelectedArticles}
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
      {/* {articles.length > 0 && (
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
      )} */}
      {/* DataGrid */}
      <TableGrid
        loading={loading}
        articles={articles}
        selectedArticles={selectedArticles}
        setSelectedArticles={setSelectedArticles}
        handleRowClick={handleRowClick}
        getRowId={getRowId}
        renderArticle={renderArticle}
        fetchReadArticleFile={fetchReadArticleFile}
        setEditDetailsDialogOpen={setEditDetailsDialogOpen}
        setSelectedArticle={setSelectedArticle}
        paginationModel={paginationModel}
        currentPage={currentPage}
        recordsPerPage={recordsPerPage}
        handleLeftPagination={handleLeftPagination}
        handleRightPagination={handleRightPagination}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        setPageCheck={setPageCheck}
        handleRowCheck={handleRowCheck}
        fetchTags={fetchTags}
        setFetchTags={setFetchTags}
        SelectAllModal={SelectAllModal}
      />
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
        fetchTags={fetchTags}
        setFetchTags={setFetchTags}
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
