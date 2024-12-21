import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { EditionType, PEERS_VOLUME_VISIBILITY, Print, PublicationGroup } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const MixedChart = dynamic(() => import('src/components/charts/MixedChart'))
const CombinedBarChart = dynamic(() => import('src/components/charts/CombinedBarChart'))
const BroadWidget = dynamic(() => import('src/components/widgets/BroadWidget'))
const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))
const DataTable = dynamic(() => import('src/components/datatable/Table'))

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

  const { anchorEl: categoryAnchorEl, openMenu: openCategory, closeMenu: closeCategory } = useMenu()
  const { anchorEl: subCategoryAnchorEl, openMenu: openSubCategory, closeMenu: closeSubCategory } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState({ category: 0, subCategory: -1 })

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
    if (!(data && data[selectedCategory.category])) {
      setTableData(initialTableData)

      return
    }

    const tableData = { ...initialTableData }
    const publicationGroups = data[selectedCategory.category]?.PublicationGroup?.buckets ?? []

    const newPublicationGroups =
      selectedCategory.subCategory !== -1 ? [publicationGroups.at(selectedCategory.subCategory)] : publicationGroups

    newPublicationGroups.forEach((dataItem, index) => {
      const companies = dataItem?.CompanyTag?.FilterCompany?.Company?.buckets || []
      const volScore = []
      const visScore = []
      const visSov = []
      const volSov = []
      const qe = []

      companies?.forEach((company, companyIndex) => {
        if (index === 0) {
          tableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }
        volScore.push(Math.trunc(company.doc_count ?? 0))
        volSov.push(Math.trunc(company.doc_sov ?? 0))
        visScore.push(Math.trunc(company.V_Score?.value ?? 0))
        visSov.push(Math.trunc(company.V_Sov?.value ?? 0))
        qe.push(Math.trunc(company.QE?.value ?? 0))
      })
      tableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      tableData.volScore.push(volScore)
      tableData.visSov.push(visSov)
      tableData.visScore.push(visScore)
      tableData.volSov.push(volSov)
      tableData.qe.push(qe)
    })

    setTableData(tableData)
  }, [data, selectedCategory.category, selectedCategory.subCategory])

  useEffect(() => {
    setSelectedCategory({ category: 0, subCategory: -1 })
  }, [selectMediaType])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory.category] && (
        <Button size='small' onClick={openCategory} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory.category].key}
        </Button>
      )}
      {(data[selectedCategory.category]?.PublicationGroup?.buckets[selectedCategory.subCategory] ||
        selectedCategory.subCategory === -1) && (
        <Button size='small' onClick={openSubCategory} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory.category]?.PublicationGroup?.buckets[selectedCategory.subCategory]?.key ??
            'All Publication Groups'}
        </Button>
      )}

      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={closeCategory}
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),
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
              setSelectedCategory({ subCategory: -1, category: i })
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
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),
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
        <MenuItem
          selected={selectedCategory.subCategory === -1}
          onClick={() => {
            setSelectedCategory(prev => ({ ...prev, subCategory: -1 }))

            closeSubCategory()
          }}
        >
          All Publication Groups
        </MenuItem>
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
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      apiActions={apiActions}
      datagrid={{ columns, tableData, colGroupSpan: 5, id: 'topPublication-table' }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart, id: 'topPublication-combined-chart' } }}
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
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),
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
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),
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
      charts={{ bar: { component: MixedChart, id: 'topPublication-mixed-chart' } }}
    />
  )
}

export default TopPublication
