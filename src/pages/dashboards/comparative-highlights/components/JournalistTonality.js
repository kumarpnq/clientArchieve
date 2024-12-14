import React, { useEffect, useState } from 'react'
import { Journalist, Print, TONALITY_BREAKUP } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import StackChart from 'src/components/charts/StackChart'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 200 },
  { field: 'positive', headerName: 'Positive', minWidth: 150, description: 'Positive' },
  { field: 'neutral', headerName: 'Neutral', minWidth: 150, description: 'Neutral' },
  { field: 'negative', headerName: 'Negative', minWidth: 150, description: 'Negative' }
]

const initialMetrics = { labels: [], stack: { Positive: [], Neutral: [], Negative: [] } }

function JournalistTonality() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: TONALITY_BREAKUP,
    mediaType: selectMediaType,
    category: Journalist,
    path: `data.doc.Report.CompanyTag.FilterCompany.Company.buckets`
  })
  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const [metrics, setMetrics] = useState(initialMetrics)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    setRows([])
    setMetrics(initialMetrics)
    setSelectedCategory(0)

    if (!data) return
    const metrics = structuredClone(initialMetrics)

    const newData = data.map(data => {
      metrics.labels.push(data.key)
      metrics.stack.Positive.push(Math.trunc(data.Positive.value))
      metrics.stack.Neutral.push(Math.trunc(data.Neutral.value))
      metrics.stack.Negative.push(Math.trunc(data.Negative.value))

      return {
        id: data.key,
        key: data.key,
        positive: Math.trunc(data.Positive?.value),
        neutral: Math.trunc(data.Neutral?.value),
        negative: Math.trunc(data.Negative?.value)
      }
    })
    setMetrics(metrics)
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
        className='cancelSelection'
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
      title='Colgate-Palmolive vs. Peers – Tonality Break-up'
      description='Keep track of companies and their reputation'
      loading={loading}
      metrics={metrics}
      apiActions={apiActions}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}
      charts={{ stack: { component: StackChart } }}
    />
  )
}

export default JournalistTonality
