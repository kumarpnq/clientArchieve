import React, { useState } from 'react'
import { Box, Checkbox, CircularProgress, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { Icon } from '@iconify/react'
import Pagination from '../OnlineHeadlinePagination'
import SelectBox from 'src/@core/components/select'
import OptionsMenu from 'src/@core/components/option-menu'
import { FixedSizeList as List } from 'react-window'
import dayjs from 'dayjs'
import { styled } from '@mui/system'
import { tooltipClasses } from '@mui/material/Tooltip'
import useResponsiveHeadline from 'src/hooks/useResponsiveHeadline'

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

  const [tableSelect, setTableSelect] = useState({})
  const [tableSelectTwo, setTableSelectTwo] = useState({})
  const halfIndex = Math.ceil(socialFeeds.length / 2)
  const firstPortionArticles = socialFeeds.slice(0, halfIndex)
  const secondPortionArticles = socialFeeds.slice(halfIndex)
  const { listWidth, getMobileViewHeadlineWidth } = useResponsiveHeadline()

  const toggleCheckboxSelection = (socialFeedId, companies, setTableSelectFunc) => {
    setTableSelectFunc(prev => ({
      ...prev,
      [socialFeedId]: !prev[socialFeedId] ? socialFeedId : null
    }))

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
    toggleCheckboxSelection(socialFeedId, companies, setTableSelect)
  }

  const handleCheckboxChangeTwo = (socialFeedId, companies) => {
    toggleCheckboxSelection(socialFeedId, companies, setTableSelectTwo)
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

  const similarSocialFeeds = [
    { socialFeedId: 1, publicationName: 'Social Feed 1' },
    { socialFeedId: 2, publicationName: 'Social Feed 2' },
    { socialFeedId: 3, publicationName: 'Social Feed 3' }
  ]

  const Row = ({ index, style }) => {
    const firstArticle = firstPortionArticles[index]
    const secondArticle = secondPortionArticles[index]

    return (
      <tr key={index} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 5, ...style }}>
        {/* first portion */}
        <div style={{ width: '50%', marginTop: '4px' }}>
          {firstArticle && (
            <div style={{ width: '100%' }}>
              <td className='table-data'>
                <Checkbox
                  checked={
                    Boolean(tableSelect[firstArticle.socialFeedId]) || isArticleSelected(firstArticle.socialFeedId)
                  }
                  onChange={() => handleCheckboxChange(firstArticle.socialFeedId, firstArticle?.companies)}
                />
              </td>
              <td className='table-data'>
                <SelectBox
                  icon={<Icon icon='ion:add' />}
                  iconButtonProps={{
                    // sx: { color: Boolean(firstArticle.publication?.length) ? 'primary.main' : 'primary' }
                    sx: { color: Boolean(similarSocialFeeds.length) ? 'primary.main' : 'primary' }
                  }}
                  renderItem='publicationName'
                  renderKey='socialFeedId'
                  // menuItems={firstArticle.publications}
                  menuItems={similarSocialFeeds}
                  selectedItems={selectedArticles}
                  setSelectedItems={setSelectedArticles}
                />
              </td>
              <td className='table-data' width={'75%'}>
                <CustomTooltip title={getTooltipContent(firstArticle)} arrow>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}
                  >
                    <span className='headline'>{firstArticle?.headline}</span>

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
                      text: 'Edit Detail',
                      menuItemProps: {
                        onClick: () => {
                          handleEdit(firstArticle)
                        }
                      }
                    },

                    {
                      text: 'Article View',
                      menuItemProps: {
                        onClick: () => {
                          setSelectedArticle(firstArticle)
                          setOpenArticleView(true)
                        }
                      }
                    }
                  ]}
                />
              </td>
            </div>
          )}
        </div>
        {/* dummy row for space */}
        {/* <td style={{ padding: '6px' }}></td> */}
        {/* second portion */}
        <div style={{ width: '50%' }}>
          {secondArticle && (
            <div style={{ width: '100%' }}>
              <td className='table-data'>
                <Checkbox
                  checked={
                    Boolean(tableSelectTwo[secondArticle.socialFeedId]) || isArticleSelected(secondArticle.socialFeedId)
                  }
                  onChange={() => handleCheckboxChangeTwo(secondArticle.socialFeedId, secondArticle.companies)}
                />
              </td>
              <td className='table-data'>
                <SelectBox
                  icon={<Icon icon='ion:add' />}
                  iconButtonProps={{
                    sx: { color: Boolean(secondArticle?.publication?.length) ? 'primary.main' : 'primary' }
                  }}
                  renderItem='publicationName'
                  renderKey='socialFeedId'
                  menuItems={secondArticle.publications}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </td>
              <td className='table-data' width={'75%'}>
                <CustomTooltip title={getTooltipContent(secondArticle)} arrow>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}
                  >
                    <span className='headline'>{secondArticle?.headline}</span>

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
                      text: 'Edit Detail',
                      menuItemProps: {
                        onClick: () => {
                          handleEdit(secondArticle)
                        }
                      }
                    },
                    {
                      text: 'View Article',
                      menuItemProps: {
                        onClick: () => {
                          const articleCode = secondArticle.link
                          window.open(`/article-view?articleCode=${articleCode}`, '_blank')
                        }
                      }
                    }
                  ]}
                />
              </td>
            </div>
          )}
        </div>
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
            menuItems={firstArticle.publications}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </td>
        <td className='table-data'>
          <CustomTooltip title={getTooltipContent(firstArticle)} arrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
              <span className='headline' style={{ width: getMobileViewHeadlineWidth(listWidth) }}>
                {firstArticle?.headline}
              </span>

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
                text: 'Edit Detail',
                menuItemProps: {
                  onClick: () => {
                    handleEdit(firstArticle)
                  }
                }
              },
              {
                text: 'View Article',
                menuItemProps: {
                  onClick: () => {
                    const articleCode = firstArticle.link
                    window.open(`/article-view?articleCode=${articleCode}`, '_blank')
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
                        height={500}
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
                  <List height={500} itemCount={socialFeeds.length} itemSize={50} width={listWidth}>
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
