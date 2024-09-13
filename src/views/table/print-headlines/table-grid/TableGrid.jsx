import {
  Box,
  Checkbox,
  CircularProgress,
  Fab,
  List,
  ListItem,
  Tooltip,
  tooltipClasses,
  Typography,
  useMediaQuery
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from '../Pagination'
import OptionsMenu from 'src/@core/components/option-menu'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import styled from '@emotion/styled'
import pdfDownload from '../pdf/pdfdownload'

const TableGrid = ({
  loading,
  articles,

  selectedArticles,
  setSelectedArticles,
  handleRowClick,
  fetchReadArticleFile,
  setEditDetailsDialogOpen,
  setSelectedArticle,
  handleRowCheck,
  paginationModel,
  currentPage,
  recordsPerPage,
  handleLeftPagination,
  handleRightPagination,
  handleRecordsPerPageChange

  // setPageCheck
}) => {
  const [tableSelect, setTableSelect] = useState({})
  const isNotResponsive = useMediaQuery('(min-width: 1000px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')

  useCallback(
    tableSelect => {
      const arr = []
      Object.keys(tableSelect)?.map(element => arr.push(tableSelect[element]))
      setSelectedArticles(arr)
    },
    [tableSelect]
  )

  const articleColumns = [
    // {
    //   flex: 0.1,
    //   minWidth: 5,
    //   headerName: 'Select',
    //   field: 'select',
    //   renderCell: params => (
    //     // <MemoizedCheckbox
    //     //   onClick={e => {
    //     //     e.stopPropagation()
    //     //     handleSelect(params.row)
    //     //   }}
    //     //   checked={selectedArticles.some(selectedArticle => selectedArticle.articleId === params.row.articleId)}
    //     // />
    //     <Checkbox
    //       onClick={e => {
    //         // e.stopPropagation()
    //         if (tableSelect[params.row.articleId]?.checkedState) {
    //           setTableSelect({ ...tableSelect, [params.row.articleId]: { checkedState: false, ...params } })
    //         } else {
    //           setTableSelect(prev => {
    //             return delete prev[params.row.articleId];
    //           })
    //         }
    //       }}
    //       checked={tableSelect[params.row.articleId]?.checkedState}
    //     />
    //   )
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 5,
    //   headerName: 'Grp',
    //   field: 'Grp',
    //   renderCell: params => {
    //     const publications = params.row.children || []
    //     return (
    //       <SelectBox
    //         icon={<Icon icon='ion:add' />}
    //         iconButtonProps={{ sx: { color: Boolean(publications.length) ? 'primary.main' : 'primary' } }}
    //         renderItem='publicationName'
    //         renderKey='articleId'
    //         menuItems={publications}
    //         selectedItems={selectedArticles}
    //         setSelectedItems={setSelectedArticles}
    //       />
    //     )
    //   }
    // },
    // {
    //   flex: 0.6,
    //   minWidth: 240,
    //   field: 'article',
    //   headerName: 'Article',
    //   renderCell: renderArticle
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 5,
    //   field: 'more',
    //   headerName: 'More',
    //   renderCell: params => (
    //     <OptionsMenu
    //       iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
    //       options={[
    //         {
    //           text: 'View Article',
    //           menuItemProps: {
    //             onClick: () => {
    //               const articleCode = params.row.link
    //               window.open(`/article-view?articleCode=${articleCode}`, '_blank')
    //             }
    //           }
    //         },
    //         {
    //           text: 'Edit Detail',
    //           menuItemProps: {
    //             onClick: () => {
    //               fetchReadArticleFile('jpg', params.row)
    //               setEditDetailsDialogOpen(true)
    //               setSelectedArticle(params.row)
    //             }
    //           }
    //         }
    //       ]}
    //     />
    //   )
    // }
  ]

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

  const getTooltipContent = row => {
    console.log(row)

    const companies = Array.isArray(row.companies) ? row.companies : []

    return (
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
              {companies.length > 1 ? companies.map(company => company.name).join(', ') : companies[0]?.name || 'N/A'}
            </Typography>
          </Typography>
        </ListItem>
      </List>
    )
  }

  const renderArticle = params => {
    const { row } = params

    const formattedDate = dayjs(row.articleDate).format('DD-MM-YYYY')

    return (
      <CustomTooltip title={getTooltipContent(row)} arrow>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* <CustomTooltip title={getTooltipContent(row)} arrow> */}
          <Typography
            noWrap
            variant='body2'
            sx={{ color: 'text.primary', fontWeight: 600 }}
            onClick={() => {
              const url = `/PDFView?articleId=${row?.articleId}`
              window.open(url, '_blank')
            }}
          >
            {row.headline}
          </Typography>
          {/* </CustomTooltip> */}
          <Typography noWrap variant='caption'>
            {row.publication}
            <span style={{ marginLeft: '4px' }}>({formattedDate})</span>
          </Typography>
        </Box>
      </CustomTooltip>
    )
  }

  const customArticleHeader = [
    {
      field: 'Grp',
      headerName: 'Grp',
      width: 70,
      editable: false,
      renderCell: params => {
        const publications = params.row.children || []

        return (
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{ sx: { color: Boolean(publications.length) ? 'primary.main' : 'primary' } }}
            renderItem='publicationName'
            renderKey='articleId'
            menuItems={publications}
            selectedItems={selectedArticles}
            setSelectedItems={setSelectedArticles}
          />
        )
      }
    },
    {
      width: 370,
      editable: false,
      field: 'article',
      headerName: 'Article',
      renderCell: renderArticle
    },
    {
      width: 100,
      editable: false,
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

  return (
    <Box p={2}>
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isNotResponsive ? (
            <Box display='flex'>
              {/* left column */}
              {isMobileView ? null : (
                <Box flex={1} p={2} pr={1}>
                  <DataGrid
                    autoHeight
                    rows={articles.slice(0, articles.length / 2)}
                    columns={customArticleHeader}
                    pagination={false}
                    onRowClick={params => handleRowClick(params)}
                    onRowSelectionModelChange={item => handleRowCheck('left', item)}
                    getRowId={row => row.articleId}
                    hideFooter
                    disableColumnMenu
                    checkboxSelection
                    disableRowSelectionOnClick
                    rowSelectionModel={selectedArticles.map(selectedArticle => selectedArticle.articleId)}
                  />
                </Box>
              )}

              <Box flex='1' p={2} pl={isMobileView ? 0 : 1}>
                <DataGrid
                  autoHeight
                  rows={articles.slice(articles.length / 2, articles.length)}
                  columns={customArticleHeader}
                  pagination={false}
                  onRowClick={params => handleRowClick(params)}
                  onRowSelectionModelChange={item => handleRowCheck('right', item)}
                  getRowId={row => row.articleId}
                  disableColumnMenu
                  hideFooter
                  checkboxSelection
                  disableRowSelectionOnClick
                  rowSelectionModel={selectedArticles.map(selectedArticle => selectedArticle.articleId)}
                />
              </Box>
            </Box>
          ) : (
            <DataGrid
              autoHeight
              disableColumnMenu
              rows={articles}
              columns={customArticleHeader.filter(column => {
                column.field !== 'select' && column.field !== 'edit' && !(column.field === 'date' && isNarrowMobileView)

                return true
              })}
              pagination={false}
              onRowClick={params => handleRowClick(params)}
              onRowSelectionModelChange={(item, params) => handleRowCheck('center', item)}
              getRowId={row => row.articleId}
              hideFooter
              checkboxSelection
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
  )
}

export default React.memo(TableGrid)
