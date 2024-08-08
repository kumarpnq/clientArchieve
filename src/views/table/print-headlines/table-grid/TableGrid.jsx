import { Box, Checkbox, CircularProgress } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useCallback } from 'react'
import Pagination from '../Pagination'
import OptionsMenu from 'src/@core/components/option-menu'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'

const TableGrid = ({
  loading,
  isNotResponsive,
  isMobileView,
  articles,
  leftArticles,
  rightArticles,
  selectedArticles,
  setSelectedArticles,
  handleRowClick,
  getRowId,
  renderArticle,
  fetchReadArticleFile,
  setEditDetailsDialogOpen,
  setSelectedArticle,
  paginationModel,
  currentPage,
  recordsPerPage,
  handleLeftPagination,
  handleRightPagination,
  handleRecordsPerPageChange,
  setPageCheck
}) => {
  const handleSelect = useCallback(
    article => {
      setSelectedArticles(prevSelectedArticles => {
        const isSelected = prevSelectedArticles.some(selectedArticle => selectedArticle.articleId === article.articleId)

        const updatedSelectedArticles = new Set(prevSelectedArticles)

        if (isSelected) {
          updatedSelectedArticles.delete(article)
        } else {
          updatedSelectedArticles.add(article)
        }

        setPageCheck(articles.every(a => updatedSelectedArticles.has(a)))

        return [...updatedSelectedArticles]
      })
    },
    [articles]
  )

  const MemoizedCheckbox = React.memo(({ onClick, checked }) => <Checkbox onClick={onClick} checked={checked} />)

  const articleColumns = [
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Select',
      field: 'select',
      renderCell: params => (
        <MemoizedCheckbox
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
                <Box flex='1' p={2} pr={1}>
                  <DataGrid
                    autoHeight
                    rows={leftArticles}
                    columns={articleColumns}
                    pagination={false}
                    onRowClick={params => handleRowClick(params)}
                    getRowId={getRowId}
                    disableRowSelectionOnClick
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
                  pagination={false}
                  onRowClick={params => handleRowClick(params)}
                  getRowId={getRowId}
                  disableRowSelectionOnClick
                  hideFooter
                />
              </Box>
            </Box>
          ) : (
            <DataGrid
              autoHeight
              rows={articles}
              columns={articleColumns.filter(column => {
                column.field !== 'select' && column.field !== 'edit' && !(column.field === 'date' && isNarrowMobileView)

                return true
              })}
              pagination={false}
              onRowClick={params => handleRowClick(params)}
              getRowId={getRowId}
              disableRowSelectionOnClick
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
  )
}

export default React.memo(TableGrid)
