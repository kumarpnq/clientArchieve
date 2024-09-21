import React, { useState } from 'react'
import { Box, Checkbox, CircularProgress, ListItem, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import Pagination from '../OnlineHeadlinePagination'
import SelectBox from 'src/@core/components/select'
import OptionsMenu from 'src/@core/components/option-menu'
import { FixedSizeList as List } from 'react-window'
import dayjs from 'dayjs'
import { styled } from '@mui/system'
import { tooltipClasses } from '@mui/material/Tooltip'

const Grid = props => {
  const {
    loading,
    leftSocialFeeds,
    rightSocialFeeds,
    socialFeeds,
    getRowId,
    handleSelect,
    handleEdit,
    handleView,
    setSelectedArticle,
    setOpenArticleView,
    selectedArticles,
    selectedItems,
    setSelectedItems,
    renderSocialFeed,
    paginationModel,
    currentPage,
    recordsPerPage,
    handleLeftPagination,
    handleRightPagination,
    handleRecordsPerPageChange,
    handleRowClick
  } = props
  const isNotResponsive = useMediaQuery('(min-width: 1100px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNarrowMobileView = useMediaQuery('(max-width: 405px)')
  const [tableSelect, setTableSelect] = useState({})
  const [tableSelectTwo, setTableSelectTwo] = useState({})
  const halfIndex = Math.ceil(socialFeeds.length / 2)
  const firstPortionArticles = socialFeeds.slice(0, halfIndex)
  const secondPortionArticles = socialFeeds.slice(halfIndex)

  const handleCheckboxChange = socialFeedId => {
    setTableSelect(prev => ({
      ...prev,
      [socialFeedId]: !prev[socialFeedId] ? socialFeedId : null
    }))
  }

  const handleCheckboxChangeTwo = socialFeedId => {
    setTableSelectTwo(prev => ({
      ...prev,
      [socialFeedId]: !prev[socialFeedId] ? socialFeedId : null
    }))
  }

  const isArticleSelected = socialFeedId => {
    return selectedArticles.some(article => article.socialFeedId === socialFeedId)
  }

  const publications = [
    { publicationName: 'The Hindu', publicationId: 'hindu' },
    { publicationName: 'The Muslim', publicationId: 'muslim' },
    { publicationName: 'The Christian', publicationId: 'christian' }
  ]

  const socialFeedColumns = [
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Select',
      field: 'select',
      renderCell: params => (
        <Checkbox
          onClick={e => {
            e.stopPropagation()
            handleSelect(params.row)
          }}
          checked={selectedArticles.some(selectedArticle => selectedArticle.socialFeedId === params.row.socialFeedId)}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 5,
      headerName: 'Grp',
      field: 'Grp',
      renderCell: params => {
        const publications = params.row.children || []

        return (
          <SelectBox
            icon={<Icon icon='ion:add' />}
            iconButtonProps={{ sx: { color: publications.length ? 'primary.main' : 'primary' } }}
            renderItem='publicationName'
            renderKey='socialFeedId'
            menuItems={publications}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        )
      }
    },
    {
      flex: 0.6,
      minWidth: 240,
      field: 'socialFeed',
      headerName: 'Social Feed',
      renderCell: renderSocialFeed
    },

    {
      flex: 0.1,
      minWidth: 5,
      field: 'edit',
      headerName: 'Edit',
      renderCell: params => (
        <OptionsMenu
          iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
          options={[
            {
              text: 'Edit Detail',
              menuItemProps: {
                onClick: () => {
                  handleEdit(params.row)
                }
              }
            },

            {
              text: 'Article View',
              menuItemProps: {
                onClick: () => {
                  setSelectedArticle(params.row)
                  setOpenArticleView(true)
                }
              }
            }
          ]}
        />
      )
    }
  ]

  const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.background.default, // Use default background color for dark theme
        color: theme.palette.text.primary, // Use primary text color for dark theme
        boxShadow: theme.shadows[1],
        fontSize: 11,
        maxWidth: '300px', // Set the maximum width for better readability
        '& .MuiTooltip-arrow': {
          color: theme.palette.background.default // Use default background color for the arrow in dark theme
        }
      }
    })
  )

  const getTooltipContent = row => (
    <List>
      <ListItem>
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
          Summary :{' '}
          <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
            {row?.summary}
          </Typography>
        </Typography>
      </ListItem>

      <ListItem>
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
          Companies :{' '}
          <Typography component='span' sx={{ color: 'text.primary', fontWeight: 'normal', fontSize: '0.812rem' }}>
            {row.companies.length > 1
              ? row?.companies?.map(company => company.name).join(', ')
              : row.companies[0]?.name}
          </Typography>
        </Typography>
      </ListItem>
    </List>
  )

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
                checked={
                  Boolean(tableSelect[firstArticle.socialFeedId]) || isArticleSelected(firstArticle.socialFeedId)
                }
                onChange={() => handleCheckboxChange(firstArticle.socialFeedId)}
              />
            </td>
            <td className='table-data'>
              <SelectBox
                icon={<Icon icon='ion:add' />}
                iconButtonProps={{
                  sx: { color: Boolean(firstArticle.publication?.length) ? 'primary.main' : 'primary' }
                }}
                renderItem='publicationName'
                renderKey='socialFeedId'
                menuItems={firstArticle.publications}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </td>
            <td className='table-data'>
              {/* <CustomTooltip title={getTooltipContent(firstArticle)} arrow> */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
                <span className='headline'>{firstArticle.headline.substring(0, 70) + '...'}</span>
                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                  {firstArticle.publisher}
                  <span style={{ marginLeft: '4px' }}>({dayjs(firstArticle.feedDate).format('DD-MM-YYYY')})</span>
                </span>
              </div>
              {/* </CustomTooltip> */}
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
          </>
        )}

        <td style={{ padding: '6px' }}></td>

        {/* second portion */}
        {secondArticle && (
          <>
            <td className='table-data'>
              <Checkbox
                checked={
                  Boolean(tableSelectTwo[secondArticle.socialFeedId]) || isArticleSelected(secondArticle.socialFeedId)
                }
                onChange={() => handleCheckboxChangeTwo(secondArticle.socialFeedId)}
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
            <td className='table-data'>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', justifyContent: 'space-between' }}>
                <span className='headline'>{secondArticle.headline}</span>
                <span style={{ fontSize: '0.7em', textAlign: 'left' }}>
                  {secondArticle.publisher}
                  <span style={{ marginLeft: '4px' }}>({dayjs(secondArticle.feedDate).format('DD-MM-YYYY')})</span>
                </span>
              </div>
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
                    text: 'Article View',
                    menuItemProps: {
                      onClick: () => {
                        setSelectedArticle(secondArticle)
                        setOpenArticleView(true)
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
                <Box flex={1} p={2} pr={1}>
                  {socialFeeds.length > 0 ? (
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
              rows={socialFeeds}
              columns={socialFeedColumns.filter(column => {
                if (isMobileView) {
                  return column.field !== 'select' && column.field !== 'edit' && !isNarrowMobileView
                }

                return true
              })}
              pagination={false}
              onRowClick={params => handleRowClick(params)}
              getRowId={getRowId}
              hideFooter
            />
          )}
          {socialFeeds.length > 0 && (
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

export default Grid
