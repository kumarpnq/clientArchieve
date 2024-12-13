import React, { useEffect, useState } from 'react'
import { GENRE_THEME, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import MixedChart from 'src/components/charts/MixedChart'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' }

  // { field: 'visSov', headerName: 'Vis SOV', minWidth: 100, description: 'Visibility Share of Voice' }
]

const initialMetrics = { labels: [], line: { QE: [] }, bar: { Image: [], Visibility: [] } }

function ThemePerformance() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: GENRE_THEME,
    mediaType: selectMediaType,
    path: `data.doc.Report.CompanyTag.FilterCompany.ReportingSubject.buckets`
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

    const newData = data[selectedCategory].Company?.buckets.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Visibility.push(Math.trunc(data.V_Score.value))
      metrics.bar.Image.push(Math.trunc(data.I_Score.value))
      metrics.line.QE.push(Math.trunc(data.QE.value))

      return {
        id: data.key,
        key: data.key,
        volScore: data.doc_count,
        visScore: Math.trunc(data.V_Score.value),
        qe: Math.trunc(data.QE.value)
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
      title='Theme Performance'
      description='Keep track of companies and their reputation'
      loading={loading}
      metrics={metrics}
      apiActions={apiActions}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}
      charts={{ bar: { component: MixedChart } }}
    />
  )
}

export default ThemePerformance
