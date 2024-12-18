import React, { useEffect, useMemo, useState } from 'react'
import { EditionType, PEERS_VOLUME_VISIBILITY, Print, PublicationGroup, PublicationName } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import MixedChart from 'src/components/charts/MixedChart'
import DataGrid from 'src/components/datagrid/DataGrid'
import DataTable from 'src/components/datatable/Table'
import CombinedBarChart from 'src/components/charts/CombinedBarChart'

// import MixedChart from 'src/components/charts/MixedChart'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  {
    field: 'volSov',
    headerName: 'Vol SOV',
    minWidth: 100,
    description: 'Volume Share of Voice',
    renderCell: params => `${params.row.volSov}%`
  },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  {
    field: 'visSov',
    headerName: 'Vis SOV',
    minWidth: 100,
    description: 'Visibility Share of Voice',
    renderCell: params => `${params.row.visSov}%`
  },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' }
]

const initialMetrics = { labels: [], bar: { Volume: [], Visibility: [] }, line: { QE: [] } }
const tableRange = 5

const Title = 'Top Publication'
const Description = 'Keep track of companies and their reputation'

function TopPublication(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: PEERS_VOLUME_VISIBILITY,
    mediaType: selectMediaType,
    category: EditionType,
    subCategory: PublicationGroup,
    path: `data.doc.Report.${EditionType}.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  return matches ? (
    <TopPublicationTable
      data={data}
      loading={loading}
      selectMediaType={selectMediaType}
      changeMediaType={changeMediaType}
    />
  ) : (
    <TopPublicationWidget
      data={data}
      loading={loading}
      selectMediaType={selectMediaType}
      changeMediaType={changeMediaType}
    />
  )
}

function TopPublicationTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    volScore: [],
    volSov: [],
    visScore: [],
    visSov: [],
    qe: [],
    columnGroup: []
  })
  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl: categoryAnchorEl, openMenu: openCategory, closeMenu: closeCategory } = useMenu()

  const metrics = useMemo(() => {
    // Ensure all data exists and is properly structured
    if (!tableData.rows.length || !tableData.columnGroup.length) return null

    return {
      labels: tableData.rows,
      labelGroup: tableData.columnGroup,
      bar: {
        Volume: tableData.volScore.length ? tableData.volScore.map(scores => scores || [0]) : [[0]],
        Visibility: tableData.visScore.length ? tableData.visScore.map(scores => scores || [0]) : [[0]]
      },
      line: {
        QE: tableData.qe.length ? tableData.qe.map(scores => scores || [0]) : [[0]]
      }
    }
  }, [tableData])

  useEffect(() => {
    const initialTableData = {
      rows: [],
      volScore: [],
      volSov: [],
      visScore: [],
      visSov: [],
      qe: [],
      columnGroup: []
    }
    if (!(data && data[selectedCategory])) {
      setTableData(initialTableData)

      return
    }

    const processedTableData = { ...initialTableData }

    data[selectedCategory]?.PublicationGroup?.buckets?.slice(0, tableRange).forEach((dataItem, index) => {
      const companies = dataItem?.CompanyTag?.FilterCompany?.Company?.buckets || []
      const volScore = []
      const visScore = []
      const visSov = []
      const volSov = []
      const qe = []

      companies.slice(0, tableRange)?.forEach(company => {
        if (index === 0) {
          processedTableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }
        volScore.push(Math.trunc(company.doc_count ?? 0))
        volSov.push(Math.trunc(company.doc_sov ?? 0))
        visScore.push(Math.trunc(company.V_Score?.value ?? 0))
        visSov.push(Math.trunc(company.V_Sov?.value ?? 0))
        qe.push(Math.trunc(company.QE?.value ?? 0))
      })
      processedTableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      processedTableData.volScore.push(volScore)
      processedTableData.visSov.push(visSov)
      processedTableData.visScore.push(visScore)
      processedTableData.volSov.push(volSov)
      processedTableData.qe.push(qe)
    })

    // Update state
    setTableData(processedTableData)
  }, [data, selectedCategory])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory] && (
        <Button size='small' onClick={openCategory} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory].key}
        </Button>
      )}

      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={closeCategory}
        disableScrollLock
        className='cancelSelection'
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
              closeCategory()
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
      title={Title}
      description={Description}
      loading={loading}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      apiActions={apiActions}
      datagrid={{ columns, tableData, colGroupSpan: 5 }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart } }}
    />
  )
}

function TopPublicationWidget(props) {
  const { data, loading, selectMediaType, changeMediaType } = props
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState(initialMetrics)
  const { anchorEl: categoryAnchorEl, openMenu: openCategory, closeMenu: closeCategory } = useMenu()
  const { anchorEl: subCategoryAnchorEl, openMenu: openSubCategory, closeMenu: closeSubCategory } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState({ category: 0, subCategory: 0 })

  useEffect(() => {
    setRows([])
    setMetrics(initialMetrics)
    if (
      !(
        data &&
        data[selectedCategory.category] &&
        data[selectedCategory.category].PublicationGroup.buckets[selectedCategory.subCategory]
      )
    )
      return

    const metrics = structuredClone(initialMetrics)

    const newData = data[selectedCategory.category].PublicationGroup.buckets[
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

  useEffect(() => {
    setSelectedCategory({ category: 0, subCategory: 0 })
  }, [selectMediaType])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory.category] && (
        <Button size='small' onClick={openCategory} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory.category].key}
        </Button>
      )}
      {data[selectedCategory.category]?.PublicationGroup?.buckets[selectedCategory.subCategory] && (
        <Button size='small' onClick={openSubCategory} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory.category]?.PublicationGroup?.buckets[selectedCategory.subCategory].key}
        </Button>
      )}
      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={closeCategory}
        disableScrollLock
        className='cancelSelection'
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
              setSelectedCategory({ subCategory: 0, category: i })
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
        className='cancelSelection'
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
        {data[selectedCategory.category]?.PublicationGroup?.buckets?.map((subCategory, i) => (
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
      title={Title}
      description={Description}
      loading={loading}
      metrics={metrics}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      apiActions={apiActions}
      datagrid={{ columns, rows }}
      table={DataGrid}
      render={['charts', 'table']}
      charts={{ bar: { component: MixedChart } }}
    />
  )
}

export default TopPublication
