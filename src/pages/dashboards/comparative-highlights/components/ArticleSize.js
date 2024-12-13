import React, { useEffect, useState } from 'react'
import { ARTICLE_SIZE, Print, Region } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'headline', headerName: 'Headline', minWidth: 100, description: 'Headline' },
  { field: 'prominent', headerName: 'Prominent', minWidth: 100, description: 'Prominent' },
  { field: 'passing', headerName: 'Passing', minWidth: 100, description: 'Passing' },
  { field: 'total', headerName: 'Total', minWidth: 100, description: 'Total' }
]

// const initialMetrics = { labels: [], bar: { Volume: [], Visibility: [] } }

function ArticleSize() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: ARTICLE_SIZE,
    mediaType: selectMediaType,
    path: `data.doc.Report.CompanyTag.FilterCompany.Prominance.buckets`
  })
  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl, openMenu, closeMenu } = useMenu()

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    if (!(data && data[selectedCategory])) return

    const newData = data[selectedCategory]?.Company?.buckets.map(data => {
      const { Passing, Prominent, Headline } = data

      const total = Math.trunc(Passing?.value + Prominent?.value, Headline?.value)

      return {
        id: data.key,
        key: data.key,
        headline: Headline?.value,
        passing: Passing?.value,
        prominent: Prominent?.value,
        total
      }
    })

    setRows(newData)
  }, [data, selectedCategory])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory] && (
        <Button size='small' onClick={openMenu} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory].key}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
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
            selected={selectedCategory === i}
            onClick={() => {
              setSelectedCategory(i)
              closeMenu()
            }}
          >
            {category.key}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  ) : null

  return (
    <BroadWidget
      title='Article Size'
      description='Keep track of companies and their reputation'
      loading={loading}
      data={data}
      apiActions={apiActions}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}

      // charts={{ bar: { component: BarChart, props: { barPercentage: 0.3 } } }}
    />
  )
}

export default ArticleSize
