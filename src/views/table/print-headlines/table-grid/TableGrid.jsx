import { Box, Checkbox, CircularProgress, Divider, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from '../Pagination'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { FixedSizeList as List } from 'react-window'
import { DataGrid } from '@mui/x-data-grid'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import OptionsMenu from 'src/@core/components/option-menu'

const renderArticle = params => {
  const { row } = params
  const formattedDate = dayjs(row.articleDate).format('DD-MM-YYYY')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
        {row.headline}
      </Typography>
      <Typography noWrap variant='caption'>
        {row.publication}
        <span style={{ marginLeft: '4px' }}>({formattedDate})</span>
      </Typography>
    </Box>
  )
}

const TableGrid = ({
  loading,
  isNotResponsive,
  isMobileView,
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
}) => {
  const [tableSelect, setTableSelect] = useState({})
  const [tableSelectTwo, setTableSelectTwo] = useState({})
  const [dropdownVisible, setDropdownVisible] = useState(null)

  console.log(articles)

  const halfIndex = Math.ceil(articles.length / 2)
  const firstPortionArticles = articles.slice(0, halfIndex)
  const secondPortionArticles = articles.slice(halfIndex)

  const handleDropdownToggle = index => {
    setDropdownVisible(dropdownVisible === index ? null : index)
  }

  const handleAction = (action, article) => {
    if (action === 'view') {
      const articleCode = article.link
      window.open(`/article-view?articleCode=${articleCode}`, '_blank')
    } else if (action === 'edit') {
      fetchReadArticleFile('jpg', article)
      setEditDetailsDialogOpen(true)
      setSelectedArticle(article)
    }
    setDropdownVisible(null)
  }

  const handleCheckboxChange = articleId => {
    setTableSelect(prev => ({
      ...prev,
      [articleId]: !prev[articleId] ? articleId : null
    }))
  }

  const handleCheckboxChangeTwo = articleId => {
    setTableSelectTwo(prev => ({
      ...prev,
      [articleId]: !prev[articleId] ? articleId : null
    }))
  }

  const isArticleSelected = articleId => {
    return selectedArticles.some(article => article.articleId === articleId)
  }

  const Row = ({ index, style }) => {
    const firstArticle = firstPortionArticles[index]
    const secondArticle = secondPortionArticles[index]

    return (
      <tr key={index} style={{ width: '100%', ...style }}>
        {/* first portion */}
        {firstArticle && (
          <>
            <td className='table-data'>
              <Checkbox
                checked={Boolean(tableSelect[firstArticle.articleId]) || isArticleSelected(firstArticle.articleId)}
                onChange={() => handleCheckboxChange(firstArticle.articleId)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  sx: { color: Boolean(firstArticle.publication?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='articleId'
                menuItems={firstArticle.publications}
                selectedItems={selectedArticles}
                setSelectedItems={setSelectedArticles}
              />
            </td>
            <td className='table-data'>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
                <span
                  style={{
                    width: '25rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.9em',
                    textAlign: 'left'
                  }}
                >
                  {firstArticle.headline.substring(0, 70) + '...'}
                </span>
                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{firstArticle.publication}</span>
              </div>
            </td>
            <td className='table-data'>
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View Article',
                    menuItemProps: {
                      onClick: () => {
                        const articleCode = firstArticle.link || 'default-link'
                        window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                      }
                    }
                  },
                  {
                    text: 'Edit Detail',
                    menuItemProps: {
                      onClick: () => {
                        fetchReadArticleFile('jpg', firstArticle)
                        setEditDetailsDialogOpen(true)
                        setSelectedArticle(firstArticle)
                      }
                    }
                  }
                ]}
              />
            </td>
          </>
        )}

        {/* second portion */}
        {secondArticle && (
          <>
            <td className='table-data'>
              <Checkbox
                checked={Boolean(tableSelectTwo[secondArticle.articleId]) || isArticleSelected(secondArticle.articleId)}
                onChange={() => handleCheckboxChangeTwo(secondArticle.articleId)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  sx: { color: Boolean(secondArticle?.publication?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='articleId'
                menuItems={secondArticle.publications}
                selectedItems={selectedArticles}
                setSelectedItems={setSelectedArticles}
              />
            </td>
            <td className='table-data'>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
                <span
                  style={{
                    width: '25rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.9em',
                    textAlign: 'left'
                  }}
                >
                  {secondArticle.headline}
                </span>
                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{secondArticle.publication}</span>
              </div>
            </td>
            <td className='table-data'>
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View Article',
                    menuItemProps: {
                      onClick: () => {
                        const articleCode = secondArticle.link || 'default-link'
                        window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                      }
                    }
                  },
                  {
                    text: 'Edit Detail',
                    menuItemProps: {
                      onClick: () => {
                        fetchReadArticleFile('jpg', secondArticle)
                        setEditDetailsDialogOpen(true)
                        setSelectedArticle(secondArticle)
                      }
                    }
                  }
                ]}
              />
            </td>
          </>
        )}
      </tr>
    )
  }

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
              {isMobileView ? null : (
                <Box flex='1' p={2} pr={1}>
                  {articles.length > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          display: 'flex',

                          overflow: 'auto',
                          gap: '1.5rem',
                          justifyContent: 'space-between'
                        }}
                      >
                        <List
                          height={650}
                          itemCount={Math.max(firstPortionArticles.length, secondPortionArticles.length)}
                          itemSize={50}
                          width={'100%'}
                        >
                          {Row}
                        </List>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                      <span>No Data Found</span>
                    </div>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <DataGrid
              autoHeight
              disableColumnMenu
              rows={articles}
              columns={customArticleHeader.filter(column => {
                return column.field !== 'select' && column.field !== 'edit'
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
