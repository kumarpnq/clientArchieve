import { Box, Checkbox, CircularProgress, Divider, Tooltip, Typography } from '@mui/material'
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

const getTooltipContent = row => {
  const companies = Array.isArray(row.companies) ? row.companies : []

  return (
    <div>
      <div>
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
          Summary :{' '}
          <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
            {row.summary}
          </Typography>
        </Typography>
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
          Companies :{' '}
          <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
            {companies.length > 1 ? companies.map(company => company.name).join(', ') : companies[0]?.name || 'N/A'}
          </Typography>
        </Typography>
      </div>
    </div>
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

  console.log('ARTCIEL==>', articles)

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
              {/* <input
                type='checkbox'
                style={{ transform: 'scale(1.5)', margin: '8px' }}
                checked={Boolean(tableSelect[firstArticle.articleId]) || isArticleSelected(firstArticle.articleId)}
                onChange={() => handleCheckboxChange(firstArticle.articleId)}
              /> */}

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
                <Tooltip title={getTooltipContent(firstArticle)} arrow>
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
                  </span></Tooltip>
                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{firstArticle.publication}</span>
              </div>
            </td>
            <td className='table-data'>
              {/* <select
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
              </select> */}

              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View Article',
                    menuItemProps: {
                      onClick: () => {
                        const articleCode = firstArticle.link
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
              {/* <input
                type='checkbox'
                style={{ transform: 'scale(1.5)', margin: '8px' }}
                checked={Boolean(tableSelect[secondArticle.articleId]) || isArticleSelected(secondArticle.articleId)}
                onChange={() => handleCheckboxChange(secondArticle.articleId)}
              /> */}
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
                <Tooltip title={getTooltipContent(secondArticle)} arrow>

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
                </Tooltip>

                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{secondArticle.publication}</span>
              </div>
            </td>
            <td className='table-data'>
              {/* <select
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
              </select> */}
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View Article',
                    menuItemProps: {
                      onClick: () => {
                        const articleCode = secondArticle.link
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

  const singleRow = ({ index, style }) => {
    const article = articles[index]


    return (
      <tr key={index} style={{ width: '100%', ...style }}>
        <td className='table-data'>
          <Checkbox
            checked={Boolean(articles[article.articleId]) || isArticleSelected(article.articleId)}
            onChange={() => handleCheckboxChangeTwo(article.articleId)}
          />
        </td>
        <td className='table-data'>
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{
              sx: { color: Boolean(article?.publication?.length) ? 'primary.main' : 'primary' }
            }}
            renderItem='publicationName'
            renderKey='articleId'
            menuItems={article.publications}
            selectedItems={selectedArticles}
            setSelectedItems={setSelectedArticles}
          />
        </td>
        <td className='table-data'>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
            <span className='headline'>{article.headline}</span>
            <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{article.publication}</span>
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
                    const articleCode = article.link
                    window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                  }
                }
              },
              {
                text: 'Edit Detail',
                menuItemProps: {
                  onClick: () => {
                    fetchReadArticleFile('jpg', article)
                    setEditDetailsDialogOpen(true)
                    setSelectedArticle(article)
                  }
                }
              }
            ]}
          />
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
            <Box>
              {articles.length > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <table className='main-table'>
                    <List height={650} itemCount={articles.length} itemSize={50} width={'100%'}>
                      {singleRow}
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
