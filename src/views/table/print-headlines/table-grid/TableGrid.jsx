import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from '../Pagination'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { FixedSizeList as List } from 'react-window'



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

  const handleDropdownToggle = index => {
    setDropdownVisible(dropdownVisible === index ? null : index)
  }


  console.log("checkingselec==>", selectedArticles)

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
      [articleId]: !prev[articleId] ? articleId : null // Toggle selection for specific articleId
    }));
  };

  const handleCheckboxChangeTwo = articleId => {
    setTableSelectTwo(prev => ({
      ...prev,
      [articleId]: !prev[articleId] ? articleId : null // Toggle selection for specific articleId
    }));
  };




  const isArticleSelected = articleId => {
    return selectedArticles.some(article => article.articleId === articleId)
  }


  const Row = ({ index, style }) => {
    const article = articles[index]

    return (
      <tr key={index} style={{ width: '100%', ...style }}>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
          <input
            type='checkbox'
            style={{ transform: 'scale(1.5)', margin: '8px' }}
            checked={Boolean(tableSelect[article.articleId]) || isArticleSelected(article.articleId)}
            onChange={() => handleCheckboxChange(article.articleId)}
          />
        </td>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{ sx: { color: Boolean(article.publication?.length) ? 'primary.main' : 'primary' } }}
            renderItem='publicationName'
            renderKey='articleId'
            menuItems={article.publications}
            selectedItems={selectedArticles}
            setSelectedItems={setSelectedArticles}
          />
        </td>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between' }}>
            <span style={{ width: '25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {article.headline}
            </span>
            <span>{article.publication}</span>
          </div>
        </td>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center', position: 'relative' }}>
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
            <option value='view'>View Article</option>
            <option value='edit'>Edit Detail</option>
          </select>
        </td>

        <td style={{ padding: '8px' }}></td>

        <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center', }}>
          <input
            type='checkbox'
            style={{ transform: 'scale(1.5)', margin: '8px' }}
            checked={Boolean(tableSelectTwo[article.articleId]) || isArticleSelected(article.articleId)}
            onChange={() => handleCheckboxChangeTwo(article.articleId)}
          />
        </td>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{ sx: { color: Boolean(article?.publication?.length) ? 'primary.main' : 'primary' } }}
            renderItem='publicationName'
            renderKey='articleId'
            menuItems={article.publications}
            selectedItems={selectedArticles}
            setSelectedItems={setSelectedArticles}
          />
        </td>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between' }}>
            <span style={{ width: '25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {article.headline}
            </span>
            <span>{article.publication}</span>
          </div>
        </td>
        <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center', position: 'relative' }}>
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
            <option value='view'>View Article</option>
            <option value='edit'>Edit Detail</option>
          </select>
        </td>
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
                  {articles.length > 0 ?
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                          height={720}
                          itemCount={articles.length}
                          itemSize={80}
                          width={'100%'}
                        >
                          {Row}
                        </List>
                      </table>
                    </div> : <div style={{ textAlign: "center", marginTop: "1rem", marginBottom: "1rem" }}>
                      <span>No Data Found</span>
                    </div>
                  }
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
