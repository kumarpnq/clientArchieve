import {
  Box,
  Checkbox,
  CircularProgress,
  ListItem,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
  useMediaQuery
} from '@mui/material'
import OptionsMenu from 'src/@core/components/option-menu'
import { FixedSizeList as List } from 'react-window'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import generateLink from 'src/api/generateLink/generateLink'

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

const getTooltipContent = row => (
  <Box>
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
          {row.companies?.length > 0 ? row.companies?.map(company => company.name).join(', ') : row.companies[0]?.name}
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
  </Box>
)

const Grid = ({ articles, loading, selectedArticles, setSelectedArticles }) => {
  const isNotResponsive = useMediaQuery('(min-width: 1000px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNavCollapsed = JSON.parse(localStorage.getItem('settings'))

  const [tableSelect, setTableSelect] = useState({})
  const [tableSelectTwo, setTableSelectTwo] = useState({})

  const toggleCheckboxSelection = (articleId, articleType, companies, setTableSelectFunc) => {
    setTableSelectFunc(prev => ({
      ...prev,
      [articleId]: !prev[articleId] ? articleId : null
    }))

    setSelectedArticles(prev => {
      const updatedArticles = new Map(prev.map(article => [article.articleId, article]))

      if (updatedArticles.has(articleId)) {
        updatedArticles.delete(articleId)
      } else {
        updatedArticles.set(articleId, { articleId, articleType, companies })
      }

      return Array.from(updatedArticles.values())
    })
  }

  const handleCheckboxChange = (articleId, articleType, companies) => {
    toggleCheckboxSelection(articleId, articleType, companies, setTableSelect)
  }

  const handleCheckboxChangeTwo = (articleId, articleType, companies) => {
    toggleCheckboxSelection(articleId, articleType, companies, setTableSelectTwo)
  }

  const isArticleSelected = articleId => {
    return selectedArticles.some(article => article.articleId === articleId)
  }

  const halfIndex = Math.ceil(articles.length / 2)
  const firstPortionArticles = articles.slice(0, halfIndex)
  const secondPortionArticles = articles.slice(halfIndex)

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
                onChange={() =>
                  handleCheckboxChange(firstArticle.articleId, firstArticle.articleType, firstArticle.companies)
                }
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
              <CustomTooltip title={getTooltipContent(firstArticle)} arrow>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}
                >
                  <span className='headline' style={{ width: isNavCollapsed?.navCollapsed ? '30rem' : '25rem' }}>
                    {firstArticle.headline}
                  </span>
                  <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{firstArticle.publication}</span>
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
                        const articleCode = await generateLink(firstArticle.articleId)
                        window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                      }
                    }
                  }

                  // {
                  //   text: 'Edit Detail',
                  //   menuItemProps: {
                  //     onClick: () => {
                  //       fetchReadArticleFile('jpg', firstArticle)
                  //       setEditDetailsDialogOpen(true)
                  //       setSelectedArticle(firstArticle)
                  //     }
                  //   }
                  // }
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
                checked={Boolean(tableSelectTwo[secondArticle.articleId]) || isArticleSelected(secondArticle.articleId)}
                onChange={() =>
                  handleCheckboxChangeTwo(secondArticle.articleId, secondArticle.articleType, firstArticle.companies)
                }
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
              <CustomTooltip title={getTooltipContent(secondArticle)} arrow>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}
                >
                  <span className='headline' style={{ width: isNavCollapsed?.navCollapsed ? '30rem' : '25rem' }}>
                    {secondArticle.headline}
                  </span>
                  <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{secondArticle.publication}</span>
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
                      onClick: () => {
                        const articleCode = generateLink(secondArticle.articleId)
                        window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                      }
                    }
                  }

                  // {
                  //   text: 'Edit Detail',
                  //   menuItemProps: {
                  //     onClick: () => {
                  //       fetchReadArticleFile('jpg', secondArticle)
                  //       setEditDetailsDialogOpen(true)
                  //       setSelectedArticle(secondArticle)
                  //     }
                  //   }
                  // }
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
              sx: { color: Boolean(article?.children?.length) ? 'primary.main' : 'primary' }
            }}
            renderItem='publicationName'
            renderKey='articleId'
            menuItems={article.children}
            selectedItems={selectedArticles}
            setSelectedItems={setSelectedArticles}
          />
        </td>
        <td className='table-data'>
          <CustomTooltip title={getTooltipContent(article)} arrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
              <span className='headline'>{article.headline}</span>
              <span style={{ fontSize: '0.7em', textAlign: 'left' }}>{article.publication}</span>
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
              }

              // {
              //   text: 'Edit Detail',
              //   menuItemProps: {
              //     onClick: () => {
              //       fetchReadArticleFile('jpg', article)
              //       setEditDetailsDialogOpen(true)
              //       setSelectedArticle(article)
              //     }
              //   }
              // }
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
                          height={500}
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
                  {/* Mobile table rendering */}
                  <table className='main-table'>
                    <List height={500} itemCount={articles.length} itemSize={50} width={'100%'}>
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
        </>
      )}
    </Box>
  )
}

export default Grid