import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from '../Pagination'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

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
  const [dropdownVisible, setDropdownVisible] = useState(null)

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

  // Split the articles array into two parts
  const halfwayIndex = Math.ceil(articles.length / 2)
  const firstHalf = articles.slice(0, halfwayIndex)
  const secondHalf = articles.slice(halfwayIndex)

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
                  <div style={{ padding: '20px', height: '45rem', overflow: 'scroll' }}>
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
                      {/* First Half */}
                      <tbody style={{ width: '100%' }}>
                        {firstHalf.map((article, index) => (
                          <tr key={index} style={{ width: '100%' }}>
                            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                              <input
                                type='checkbox'
                                checked={Boolean(tableSelect[article.articleId])}
                                onChange={() => handleCheckboxChange(article.articleId)}
                              />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                              <SelectBox
                                icon={<Icon icon='ion:add' />}
                                iconButtonProps={{
                                  sx: { color: Boolean(article.publication.length) ? 'primary.main' : 'primary' }
                                }}
                                renderItem='publicationName'
                                renderKey='articleId'
                                menuItems={article.publications}
                                selectedItems={selectedArticles}
                                setSelectedItems={setSelectedArticles}
                              />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.5rem',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span
                                  style={{
                                    width: '35rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {article.headline}
                                </span>
                                <span>{article.publication}</span>
                              </div>
                            </td>
                            <td
                              style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                                position: 'relative'
                              }}
                            >
                              <select
                                data-prev=''
                                onClick={e => {
                                  const prev = e.currentTarget.getAttribute('data-prev')
                                  if (e.target.value === 'view') {
                                    handleAction('view', article)
                                    e.currentTarget.setAttribute('data-prev', 'view')
                                  }
                                  if (e.target.value === 'edit') {
                                    handleAction('edit', article)
                                    e.currentTarget.setAttribute('data-prev', 'edit')
                                  }
                                  e.currentTarget.value = '...'
                                }}
                              >
                                <option>...</option>
                                <option value={'view'}>View Article</option>
                                <option value={'edit'}>Edit Detail</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      {/* Second Half */}
                      <tbody>
                        {secondHalf.map((article, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                              <input
                                type='checkbox'
                                checked={Boolean(tableSelect[article.articleId])}
                                onChange={() => handleCheckboxChange(article.articleId)}
                              />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                              <SelectBox
                                icon={<Icon icon='ion:add' />}
                                iconButtonProps={{
                                  sx: { color: Boolean(article.publication.length) ? 'primary.main' : 'primary' }
                                }}
                                renderItem='publicationName'
                                renderKey='articleId'
                                menuItems={article.publications}
                                selectedItems={selectedArticles}
                                setSelectedItems={setSelectedArticles}
                              />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.5rem',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span
                                  style={{
                                    width: '25rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {article.headline}
                                </span>
                                <span>{article.publication}</span>
                              </div>
                            </td>
                            <td
                              style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                textAlign: 'center',
                                position: 'relative'
                              }}
                            >
                              <select
                                data-prev=''
                                onClick={e => {
                                  const prev = e.currentTarget.getAttribute('data-prev')
                                  if (e.target.value === 'view') {
                                    handleAction('view', article)
                                    e.currentTarget.setAttribute('data-prev', 'view')
                                  }
                                  if (e.target.value === 'edit') {
                                    handleAction('edit', article)
                                    e.currentTarget.setAttribute('data-prev', 'edit')
                                  }
                                  e.currentTarget.value = '...'
                                }}
                              >
                                <option>...</option>
                                <option value={'view'}>View Article</option>
                                <option value={'edit'}>Edit Detail</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
