import React, { useState } from 'react'
import { Box, Checkbox, CircularProgress, useMediaQuery } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import Pagination from '../OnlineHeadlinePagination'
import SelectBox from 'src/@core/components/select'
import OptionsMenu from 'src/@core/components/option-menu'

const Grid = props => {
  const {
    loading,
    leftSocialFeeds,
    rightSocialFeeds,
    socialFeeds,
    getRowId,

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
    handleRowClick,
    handleRowCheck
  } = props

  const isNotResponsive = useMediaQuery('(min-width: 1100px )')
  const isMobileView = useMediaQuery('(max-width: 530px)')
  const isNarrowMobileView = useMediaQuery('(max-width: 405px)')

  const socialFeedColumns = [
    // {
    //   flex: 0.1,
    //   minWidth: 5,
    //   headerName: 'Select',
    //   field: 'select',
    //   renderCell: params => (
    //     <Checkbox
    //       onClick={e => {
    //         e.stopPropagation()
    //         handleSelect(params.row)
    //       }}
    //       checked={selectedArticles.some(selectedArticle => selectedArticle.socialFeedId === params.row.socialFeedId)}
    //     />
    //   )
    // },
    {
      // flex: 0.1,
      width: 50,
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
      // flex: 0.6,
      width: 450,
      field: 'socialFeed',
      headerName: 'Social Feed',
      renderCell: renderSocialFeed
    },

    {
      // flex: 0.1,
      width: 70,
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
                <Box p={2} pr={1} width={'100%'}>
                  <DataGrid
                    autoHeight
                    rows={socialFeeds.slice(0, socialFeeds.length / 2)}
                    columns={socialFeedColumns}
                    pagination={false}
                    onRowClick={params => handleRowClick(params)}
                    onRowSelectionModelChange={item => handleRowCheck('left', item)}
                    getRowId={row => row.socialFeedId}
                    checkboxSelection
                    disableRowSelectionOnClick
                    hideFooter
                  />
                </Box>
              )}

              {/* Right Column */}
              <Box p={2} pl={isMobileView ? 0 : 1} width={'100%'}>
                <DataGrid
                  autoHeight
                  rows={socialFeeds.slice(socialFeeds.length / 2, socialFeeds.length)}
                  columns={socialFeedColumns}
                  pagination={false} // Remove pagination
                  onRowSelectionModelChange={item => handleRowCheck('left', item)}
                  onRowClick={params => handleRowClick(params)}
                  getRowId={row => row.socialFeedId}
                  checkboxSelection
                  disableRowSelectionOnClick
                  hideFooter
                />
              </Box>
            </Box>
          ) : (
            <DataGrid
              autoHeight
              rows={socialFeeds}
              columns={socialFeedColumns.filter(column => {
                // Check if it's mobile view and exclude only the "Select" and "Edit" columns
                if (isMobileView) {
                  return column.field !== 'select' && column.field !== 'edit' && !isNarrowMobileView
                }

                return true
              })}
              checkboxSelection
              pagination={false} // Remove pagination
              onRowClick={params => handleRowClick(params)}
              getRowId={row.socialFeedId}
              hideFooter
            />
          )}
          {socialFeeds.length > 0 && ( // Only render pagination if there are articles
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
