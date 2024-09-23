import { Box, Checkbox, CircularProgress, useMediaQuery } from '@mui/material'
import OptionsMenu from 'src/@core/components/option-menu'
import { FixedSizeList as List } from 'react-window'
import SelectBox from 'src/@core/components/select'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const Grid = ({ articles, loading, selectedArticles, setSelectedArticles }) => {
  const isNotResponsive = useMediaQuery('(min-width: 1000px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')

  const [tableSelect, setTableSelect] = useState({})
  const [tableSelectTwo, setTableSelectTwo] = useState({})

  const handleCheckboxChange = articleId => {
    setTableSelect(prev => ({
      ...prev,
      [articleId]: !prev[articleId] ? articleId : null
    }))

    setSelectedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId)
      } else {
        return [...prev, articleId]
      }
    })
  }

  const handleCheckboxChangeTwo = articleId => {
    setTableSelectTwo(prev => ({
      ...prev,
      [articleId]: !prev[articleId] ? articleId : null
    }))

    setSelectedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId)
      } else {
        return [...prev, articleId]
      }
    })
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
                <span className='headline'>{firstArticle.headline.substring(0, 70) + '...'}</span>
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
                        const articleCode = firstArticle.link
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
                <span className='headline'>{secondArticle.headline}</span>
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
                        const articleCode = secondArticle.link
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
                  {/* Mobile table rendering */}
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
        </>
      )}
    </Box>
  )
}

export default Grid
