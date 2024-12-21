import { Box, Checkbox, CircularProgress, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { Icon } from '@iconify/react'
import SelectBox from 'src/@core/components/select'
import OptionsMenu from 'src/@core/components/option-menu'
import { FixedSizeList as List } from 'react-window'
import dayjs from 'dayjs'
import { styled } from '@mui/system'
import { tooltipClasses } from '@mui/material/Tooltip'
import Link from 'next/link'

const Grid = props => {
  const {
    loading,
    socialFeeds,
    handleEdit,
    setSelectedArticle,
    setOpenArticleView,
    selectedArticles,
    setSelectedArticles,
    selectedItems,
    setSelectedItems
  } = props
  const isNotResponsive = useMediaQuery('(min-width: 1100px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNavCollapsed = JSON.parse(localStorage.getItem('settings'))

  const firstPortionArticles = []
  const secondPortionArticles = []

  socialFeeds.forEach((article, index) => {
    if (index % 2 === 0) {
      firstPortionArticles.push(article)
    } else {
      secondPortionArticles.push(article)
    }
  })

  const toggleCheckboxSelection = (socialFeedId, companies) => {
    setSelectedArticles(prev => {
      const updatedArticles = new Map(prev.map(article => [article.socialFeedId, article]))

      if (updatedArticles.has(socialFeedId)) {
        updatedArticles.delete(socialFeedId)
      } else {
        updatedArticles.set(socialFeedId, { socialFeedId, companies })
      }

      return Array.from(updatedArticles.values())
    })
  }

  const handleCheckboxChange = (socialFeedId, companies) => {
    toggleCheckboxSelection(socialFeedId, companies)
  }

  const handleCheckboxChangeTwo = (socialFeedId, companies) => {
    toggleCheckboxSelection(socialFeedId, companies)
  }

  const isArticleSelected = socialFeedId => {
    return selectedArticles.some(article => article.socialFeedId === socialFeedId)
  }

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
      <Box sx={{ backgroundColor: 'background.default' }}>
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
                checked={isArticleSelected(firstArticle.socialFeedId)}
                onChange={() => handleCheckboxChange(firstArticle.socialFeedId, firstArticle?.companies)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  sx: { color: Boolean(firstArticle.children?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='socialFeedId'
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
                  <Link
                    className='headline'
                    style={{
                      width: isNavCollapsed?.navCollapsed ? '30rem' : '25rem',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                    target='_blank'
                    href={firstArticle.socialFeedlink}
                  >
                    {firstArticle?.headline}
                  </Link>

                  <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                    {firstArticle.publisher}
                    <span style={{ marginLeft: '4px' }}>({dayjs(firstArticle.feedDate).format('DD-MM-YYYY')})</span>
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
                      onClick: () => {
                        setSelectedArticle(firstArticle)
                        setOpenArticleView(true)
                      }
                    }
                  },
                  {
                    text: 'Edit Detail',
                    menuItemProps: {
                      onClick: () => {
                        handleEdit(firstArticle)
                      }
                    }
                  }
                ]}
              />
            </td>
          </>
        )}
        {/* dummy row for space */}
        <td style={{ padding: '6px' }}></td>
        {/* second portion */}
        {secondArticle && (
          <>
            <td className='table-data'>
              <Checkbox
                checked={isArticleSelected(secondArticle.socialFeedId)}
                onChange={() => handleCheckboxChangeTwo(secondArticle.socialFeedId, secondArticle.companies)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  sx: { color: Boolean(secondArticle?.children?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='socialFeedId'
                menuItems={secondArticle.children}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </td>
            <td className='table-data'>
              <CustomTooltip title={getTooltipContent(secondArticle)} arrow>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}
                >
                  <Link
                    className='headline'
                    style={{
                      width: isNavCollapsed?.navCollapsed ? '30rem' : '25rem',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                    target='_blank'
                    href={secondArticle.socialFeedlink}
                  >
                    {secondArticle?.headline}
                  </Link>

                  <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                    {secondArticle.publisher}{' '}
                    <span style={{ marginLeft: '4px' }}>({dayjs(secondArticle.feedDate).format('DD-MM-YYYY')})</span>
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
                      onClick: () => {
                        setSelectedArticle(secondArticle)
                        setOpenArticleView(true)
                      }
                    }
                  },
                  {
                    text: 'Edit Detail',
                    menuItemProps: {
                      onClick: () => {
                        handleEdit(secondArticle)
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
    const firstArticle = socialFeeds[index]

    return (
      <tr key={index} style={{ width: '100%', ...style }}>
        <td className='table-data'>
          <Checkbox
            checked={Boolean(isArticleSelected(firstArticle.socialFeedId))}
            onChange={() => handleCheckboxChangeTwo(firstArticle.socialFeedId, firstArticle.companies)}
          />
        </td>
        <td className='table-data'>
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{
              sx: { color: Boolean(firstArticle?.publication?.length) ? 'primary.main' : 'primary' }
            }}
            renderItem='publicationName'
            renderKey='socialFeedId'
            menuItems={firstArticle?.children}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </td>
        <td className='table-data'>
          <CustomTooltip title={getTooltipContent(firstArticle)} arrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
              <Link
                className='headline'
                href={firstArticle.socialFeedlink}
                target='_blank'
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {firstArticle?.headline}
              </Link>

              <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                {firstArticle.publisher}{' '}
                <span style={{ marginLeft: '4px' }}>({dayjs(firstArticle.feedDate).format('DD-MM-YYYY')})</span>
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
                  onClick: () => {
                    setSelectedArticle(firstArticle)
                    setOpenArticleView(true)
                  }
                }
              },
              {
                text: 'Edit Detail',
                menuItemProps: {
                  onClick: () => {
                    handleEdit(firstArticle)
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
                <Box flex={1} p={2} pr={1}>
                  {socialFeeds.length > 0 ? (
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
              {socialFeeds.length > 0 ? (
                <table className='main-table'>
                  <List height={550} itemCount={socialFeeds.length} itemSize={50} width={'100%'}>
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

export default Grid
