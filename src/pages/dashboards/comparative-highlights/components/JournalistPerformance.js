import React, { useEffect, useState } from 'react'
import { Journalist, PEERS_VOLUME_VISIBILITY, Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import BarChart from 'src/components/charts/BarChart'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'visScore', headerName: 'Vis', minWidth: 150, description: 'Visibility' },
  { field: 'qe', headerName: 'QE', minWidth: 150, description: 'Quality of Exposure' }
]

const initialMetrics = { labels: [], bar: { QE: [], Visibility: [] } }

function JournalistPerformance() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: VISIBILITY_IMAGE_SCORE,
    mediaType: selectMediaType,
    category: Journalist,
    path: `data.doc.Report.${Journalist}.buckets`
  })

  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const [metrics, setMetrics] = useState(initialMetrics)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    if (!(data && data[selectedCategory])) return
    const metrics = structuredClone(initialMetrics)

    const newData = data[selectedCategory]?.CompanyTag?.FilterCompany?.Company?.buckets?.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Visibility.push(Math.trunc(data.V_Score?.value))
      metrics.bar.QE.push(Math.trunc(data.QE?.value))

      return {
        id: data.key,
        key: data.key,
        visScore: Math.trunc(data.V_Score?.value),
        qe: Math.trunc(data.QE?.value)
      }
    })

    setMetrics(metrics)
    setRows(newData)
  }, [data, selectedCategory])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory] && (
        <Button size='small' onClick={openMenu}>
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
            selected={selectedCategory.category === i}
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
      charts={{ bar: { component: BarChart } }}
    />
  )
}

export default JournalistPerformance
