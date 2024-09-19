import { Box, Checkbox, CircularProgress, Fab, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from '../Pagination'
import OptionsMenu from 'src/@core/components/option-menu'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

const renderArticle = params => {
  const { row } = params

  const formattedDate = dayjs(row.articleDate).format('DD-MM-YYYY')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* <CustomTooltip title={getTooltipContent(row)} arrow> */}
      <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
        {row.headline}
      </Typography>
      {/* </CustomTooltip> */}
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

  // setPageCheck
}) => {
  const [tableSelect, setTableSelect] = useState({})

  console.log('checking-->', selectedArticles)

  useCallback(
    tableSelect => {
      const arr = []
      Object.keys(tableSelect)?.map(element => arr.push(tableSelect[element]))
      setSelectedArticles(arr)
    },
    [tableSelect]
  )

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
      width: 450,
      editable: false,
      field: 'article',
      headerName: 'Article',
      renderCell: renderArticle
    },
    {
      width: 70,
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

  const [dropdownVisible, setDropdownVisible] = useState(null)

  const handleDropdownToggle = index => {
    setDropdownVisible(dropdownVisible === index ? null : index)
  }

  const handleAction = (action, article) => {
    if (action === 'view') {
      const articleCode = article.link
      window.open(`/article-view?articleCode=${articleCode}`, '_blank')
    } else if (action === 'edit') {
      fetchReadArticleFile('jpg', article.row)
      setEditDetailsDialogOpen(true)
      setSelectedArticle(article.row)
    }
    setDropdownVisible(null)
  }

  const oddIndexArray = []
  const evenIndexArray = []

  articles.forEach((item, index) => {
    if (index % 2 === 0) {
      evenIndexArray.push(item)
    } else {
      oddIndexArray.push(item)
    }
  })

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
                  {/* <DataGrid
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
                  /> */}
                  <div style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      {/* <thead>
                        <tr>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Checkbox</th>

                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>GRP</th>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>ARTICLE</th>
                          <th style={{ border: '1px solid #ccc', padding: '8px' }}>M...</th>
                        </tr>
                      </thead> */}
                      <tbody>
                        {oddIndexArray.map((article, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                              <input type='checkbox' checked={article.grp} onChange={() => {}} />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                              {' '}
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
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{article.headline}</span>
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
                                <option value={'view'}>
                                  <div style={{ padding: '10px', cursor: 'pointer' }}>View Article</div>
                                </option>

                                <option value={'edit'}>
                                  <div style={{ padding: '10px', cursor: 'pointer' }}>Edit Detail</div>
                                </option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Box>
              )}

              <Box flex='1' p={2} pl={isMobileView ? 0 : 1}>
                {/* <DataGrid
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
                /> */}
                <div style={{ padding: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    {/* <thead>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Checkbox</th>

                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>GRP</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>ARTICLE</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>M...</th>
                      </tr>
                    </thead> */}
                    <tbody>
                      {evenIndexArray.map((article, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                            <input type='checkbox' checked={article.grp} onChange={() => {}} />
                          </td>
                          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                            {' '}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{article.headline}</span>
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
                              <option value={'view'}>
                                <div style={{ padding: '10px', cursor: 'pointer' }}>View Article</div>
                              </option>

                              <option value={'edit'}>
                                <div style={{ padding: '10px', cursor: 'pointer' }}>Edit Detail</div>
                              </option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
