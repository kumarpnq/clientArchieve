import { Box, Checkbox, CircularProgress, Tooltip, tooltipClasses, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import Pagination from '../Pagination'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { FixedSizeList as List } from 'react-window'
import OptionsMenu from 'src/@core/components/option-menu'
import styled from '@emotion/styled'
import generateLink from 'src/api/generateLink/generateLink'

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      fontSize: 11,

      // maxWidth: '300px',
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.default
      }
    }
  })
)

const getTooltipContent = row => {
  const companies = Array.isArray(row.companies) ? row.companies : []

  return (
    <Box>
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
    </Box>
  )
}

const TableGrid = ({
  loading,
  articles,
  selectedArticles,
  setSelectedArticles,
  fetchReadArticleFile,
  setEditDetailsDialogOpen,
  setSelectedArticle
}) => {
  const isNotResponsive = useMediaQuery('(min-width: 1000px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNavCollapsed = JSON.parse(localStorage.getItem('settings'))

  const firstPortionArticles = []
  const secondPortionArticles = []

  articles.forEach((article, index) => {
    if (index % 2 === 0) {
      firstPortionArticles.push(article)
    } else {
      secondPortionArticles.push(article)
    }
  })

  const toggleCheckboxSelection = (articleId, companies) => {
    // setTableSelectFunc(prev => ({
    //   ...prev,
    //   [articleId]: !prev[articleId] ? articleId : null
    // }))

    setSelectedArticles(prev => {
      const updatedArticles = new Map(prev.map(article => [article.articleId, article]))

      if (updatedArticles.has(articleId)) {
        updatedArticles.delete(articleId)
      } else {
        updatedArticles.set(articleId, { articleId, companies })
      }

      return Array.from(updatedArticles.values())
    })
  }

  const handleCheckboxChange = (articleId, companies) => {
    toggleCheckboxSelection(articleId, companies)
  }

  const handleCheckboxChangeTwo = (articleId, companies) => {
    toggleCheckboxSelection(articleId, companies)
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
                checked={isArticleSelected(firstArticle.articleId)}
                onChange={() => handleCheckboxChange(firstArticle.articleId, firstArticle.companies)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  // sx: { color: Boolean(firstArticle.publication?.length) ? 'primary.main' : 'primary' }
                  sx: { color: Boolean(firstArticle?.children?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='articleId'
                menuItems={firstArticle.children}
                selectedItems={selectedArticles}
                setSelectedItems={setSelectedArticles}
              />
            </td>
            <td className='table-data'>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
                <CustomTooltip title={getTooltipContent(firstArticle)} arrow>
                  <span
                    className='headline'
                    style={{ width: isNavCollapsed?.navCollapsed ? '30rem' : '25rem' }}
                    onClick={async () => {
                      const articleCode = await generateLink(firstArticle?.articleId)
                      const url = `/PDFView?articleId=${articleCode}`
                      window.open(url, '_blank')
                    }}
                  >
                    {firstArticle.headline}
                  </span>
                </CustomTooltip>
                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                  {firstArticle.publication}
                  <span style={{ marginLeft: '4px' }}>({dayjs(firstArticle.articleDate).format('DD-MM-YYYY')})</span>
                </span>
              </div>
            </td>
            <td className='table-data'>
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View Article',
                    menuItemProps: {
                      onClick: async () => {
                        const articleCode = await generateLink(firstArticle?.articleId)
                        window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                      }
                    }
                  },
                  {
                    text: 'Edit Detail',
                    menuItemProps: {
                      onClick: async () => {
                        const articleCode = await generateLink(firstArticle.articleId)
                        const firstArticleWithLink = { ...firstArticle, link: articleCode }
                        fetchReadArticleFile('jpg', firstArticleWithLink)
                        setEditDetailsDialogOpen(true)
                        setSelectedArticle(firstArticleWithLink)
                      }
                    }
                  }
                ]}
              />
            </td>
          </>
        )}
        <td style={{ padding: '6px' }}></td>
        {/* second portion */}
        {secondArticle && (
          <>
            <td className='table-data'>
              <Checkbox
                checked={isArticleSelected(secondArticle.articleId)}
                onChange={() => handleCheckboxChangeTwo(secondArticle.articleId, secondArticle.companies)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  sx: { color: Boolean(secondArticle?.children?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='articleId'
                menuItems={secondArticle.children}
                selectedItems={selectedArticles}
                setSelectedItems={setSelectedArticles}
              />
            </td>
            <td className='table-data'>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
                <CustomTooltip title={getTooltipContent(secondArticle)} arrow>
                  <span
                    className='headline'
                    style={{ width: isNavCollapsed?.navCollapsed ? '30rem' : '25rem' }}
                    onClick={async () => {
                      const articleCode = await generateLink(secondArticle?.articleId)
                      const url = `/PDFView?articleId=${articleCode}`
                      window.open(url, '_blank')
                    }}
                  >
                    {secondArticle.headline}
                  </span>
                </CustomTooltip>

                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                  {secondArticle.publication}
                  <span style={{ marginLeft: '4px' }}>({dayjs(firstArticle.articleDate).format('DD-MM-YYYY')})</span>
                </span>
              </div>
            </td>
            <td className='table-data'>
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View Article',
                    menuItemProps: {
                      onClick: async () => {
                        const articleCode = await generateLink(secondArticle.articleId)
                        window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                      }
                    }
                  },
                  {
                    text: 'Edit Detail',
                    menuItemProps: {
                      onClick: async () => {
                        const articleCode = await generateLink(secondArticle.articleId)
                        const secondArticleWithLink = { ...secondArticle, link: articleCode }
                        fetchReadArticleFile('jpg', secondArticleWithLink)
                        setEditDetailsDialogOpen(true)
                        setSelectedArticle(secondArticleWithLink)
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
            checked={isArticleSelected(article.articleId)}
            onChange={() => handleCheckboxChangeTwo(article.articleId, article.companies)}
          />
        </td>
        <td className='table-data'>
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{
              sx: { color: Boolean(article?.children?.length) ? 'primary.main' : 'primary' }
            }}
            renderItem='publicationName'
            renderKey='articleId'
            menuItems={article?.children}
            selectedItems={selectedArticles}
            setSelectedItems={setSelectedArticles}
          />
        </td>
        <td className='table-data'>
          <CustomTooltip title={getTooltipContent(article)} arrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
              <span
                className='headline'
                onClick={async () => {
                  const articleCode = await generateLink(article?.articleId)
                  const url = `/PDFView?articleId=${articleCode}`
                  window.open(url, '_blank')
                }}
              >
                {article.headline}
              </span>
              <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                {article.publication}
                <span style={{ marginLeft: '4px' }}>({dayjs(article.articleDate).format('DD-MM-YYYY')})</span>
              </span>
            </div>
          </CustomTooltip>
        </td>
        <td className='table-data'>
          <OptionsMenu
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'View Article',
                menuItemProps: {
                  onClick: async () => {
                    const articleCode = await generateLink(article.articleId)
                    window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                  }
                }
              },
              {
                text: 'Edit Detail',
                menuItemProps: {
                  onClick: async () => {
                    const articleCode = await generateLink(article.articleId)
                    const articleWithLink = { ...article, link: articleCode }
                    fetchReadArticleFile('jpg', articleWithLink)
                    setEditDetailsDialogOpen(true)
                    setSelectedArticle(articleWithLink)
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
                      <table className='main-table'>
                        <List
                          height={550}
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
                <table className='main-table'>
                  <List height={550} itemCount={articles.length} itemSize={50} width={'100%'}>
                    {singleRow}
                  </List>
                </table>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                  <span>No Data Found</span>
                </div>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default React.memo(TableGrid)
