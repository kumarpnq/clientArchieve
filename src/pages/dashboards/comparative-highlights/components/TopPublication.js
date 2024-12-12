import React, { useEffect, useState } from 'react'
import { EditionType, PEERS_VOLUME_VISIBILITY, Print, PublicationName } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'

// import MixedChart from 'src/components/charts/MixedChart'

const columns = [
  { field: 'key', headerName: 'Publication', minWidth: 150 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100 },
  { field: 'volSov', headerName: 'Vol SOV', minWidth: 100 },
  { field: 'visScore', headerName: 'Vis', minWidth: 100 },
  { field: 'visSov', headerName: 'Vis SOV', minWidth: 100 },
  { field: 'qe', headerName: 'QE', minWidth: 100 }
]

const initialMetrics = { labels: [], bar: { Volume: [], Visibility: [] }, line: { QE: [] } }

function TopPublication() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState(initialMetrics)

  const { data, loading } = useChartAndGraphApi(PEERS_VOLUME_VISIBILITY, selectMediaType, EditionType, PublicationName)
  const { anchorEl: categoryAnchorEl, openMenu: openCategory, closeMenu: closeCategory } = useMenu()
  const { anchorEl: subCategoryAnchorEl, openMenu: openSubCategory, closeMenu: closeSubCategory } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState({ category: 0, subCategory: 0 })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    if (
      !(
        data &&
        data[selectedCategory.category] &&
        data[selectedCategory.category].PublicationName.buckets[selectedCategory.subCategory]
      )
    )
      return
    const metrics = structuredClone(initialMetrics)

    const newData = data[selectedCategory.category].PublicationName.buckets[
      selectedCategory.subCategory
    ]?.CompanyTag?.FilterCompany?.Company?.buckets.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Volume.push(Math.trunc(data.doc_count))
      metrics.bar.Visibility.push(Math.trunc(data.V_Score.value))
      metrics.line.QE.push(Math.trunc(data.QE.value))

      return {
        id: data.key,
        key: data.key,
        volScore: data.doc_count,
        volSov: Math.trunc(data.doc_sov),
        visScore: Math.trunc(data.V_Score.value),
        visSov: Math.trunc(data.V_Sov.value),
        qe: Math.trunc(data.QE.value)
      }
    })

    setMetrics(metrics)
    setRows(newData)
  }, [data, selectedCategory.category, selectedCategory.subCategory])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory.category] && (
        <Button size='small' onClick={openCategory}>
          {data[selectedCategory.category].key}
        </Button>
      )}
      {data[selectedCategory.category]?.PublicationName?.buckets[selectedCategory.subCategory] && (
        <Button size='small' onClick={openSubCategory}>
          {data[selectedCategory.category]?.PublicationName?.buckets[selectedCategory.subCategory].key}
        </Button>
      )}
      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={closeCategory}
        disableScrollLock
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            maxHeight: 450,
            overflow: 'auto',

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        {data?.map((category, i) => (
          <MenuItem
            key={category.key}
            selected={selectedCategory.category === i}
            onClick={() => {
              setSelectedCategory(prev => ({ ...prev, category: i }))
              closeCategory()
            }}
          >
            {category.key}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={subCategoryAnchorEl}
        open={Boolean(subCategoryAnchorEl)}
        onClose={closeSubCategory}
        disableScrollLock
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            maxHeight: 450,
            overflow: 'auto',

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        {data[selectedCategory.category]?.PublicationName?.buckets?.map((subCategory, i) => (
          <MenuItem
            key={subCategory.key}
            selected={selectedCategory.subCategory === i}
            onClick={() => {
              setSelectedCategory(prev => ({ ...prev, subCategory: i }))
              closeSubCategory()
            }}
          >
            {subCategory.key}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  ) : null

  return (
    <BroadWidget
      title='Top Publication'
      description='Keep track of companies and their reputation'
      loading={loading}
      apiActions={apiActions}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}

      // metrics={metrics}
      // charts={{ bar: { component: MixedChart, props: { barPercentage: 0.3 } } }}
    />
  )
}

export default TopPublication
