import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { ARTICLE_SIZE, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const BroadWidget = dynamic(() => import('src/components/widgets/BroadWidget'))
const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))
const DataTable = dynamic(() => import('src/components/datatable/Table'))

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  {
    field: 'headline',
    headerName: 'Headline',
    minWidth: 100,
    description: 'Headline',
    renderCell: params => `${params.row.headline}%`
  },
  {
    field: 'prominent',
    headerName: 'Prominent',
    minWidth: 100,
    description: 'Prominent',
    renderCell: params => `${params.row.prominent}%`
  },
  {
    field: 'passing',
    headerName: 'Passing',
    minWidth: 100,
    description: 'Passing',
    renderCell: params => `${params.row.passing}%`
  },
  {
    field: 'total',
    headerName: 'Total',
    minWidth: 100,
    description: 'Total',
    renderCell: params => `${params.row.total}%`
  }
]

// const initialMetrics = { labels: [], bar: { Volume: [], Visibility: [] } }
const Title = 'Article Size'
const Description = 'Keep track of companies and their reputation'

function ArticleSize(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: ARTICLE_SIZE,
    mediaType: selectMediaType,
    path: `data.doc.Report.CompanyTag.FilterCompany.ArticleSize.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  return matches ? (
    <ArticleTable data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  ) : (
    <ArticleWidget data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  )
}

function ArticleTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    headline: [],
    prominent: [],
    passing: [],
    total: [],
    columnGroup: []
  })
  const [selectedCategory, setSelectedCategory] = useState(-1)
  const { anchorEl, openMenu, closeMenu } = useMenu()

  useEffect(() => {
    // Reset table data
    const initialTableData = {
      rows: [],
      headline: [],
      prominent: [],
      passing: [],
      total: [],
      columnGroup: []
    }

    // Early return if no data
    if (!data || !data.length) {
      setTableData(initialTableData)

      return
    }

    // Create a deep clone of initial table data
    const tableData = { ...initialTableData }
    const articles = selectedCategory !== -1 ? [data.at(selectedCategory)] : data

    // Process data with added safety checks
    articles.forEach((dataItem, index) => {
      const companies = dataItem?.Company?.buckets || []

      // Collect company data
      const headline = []
      const passing = []
      const prominent = []
      const total = []

      companies.forEach((company, companyIndex) => {
        const Passing = Math.trunc(parseInt(company.Passing?.value || 0))
        const Headline = Math.trunc(parseInt(company.Headline?.value || 0))
        const Prominent = Math.trunc(parseInt(company.Prominent?.value || 0))
        const Total = Passing + Headline + Prominent

        // Add row names only on first iteration
        if (index === 0) {
          tableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        headline.push(Headline)
        passing.push(Passing)
        prominent.push(Prominent)
        total.push(Total)
      })

      // Add column group and scores
      tableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      tableData.headline.push(headline)
      tableData.passing.push(passing)
      tableData.prominent.push(prominent)
      tableData.total.push(total)
    })

    // Update state
    setTableData(tableData)
  }, [data, selectedCategory])

  // Render only if metrics are available
  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {(data[selectedCategory] || selectedCategory === -1) && (
        <Button size='small' onClick={openMenu} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory]?.key ?? 'All Article Sizes'}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
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
          selected={selectedCategory === -1}
          onClick={() => {
            setSelectedCategory(-1)
            closeMenu()
          }}
        >
          All Article Sizes
        </MenuItem>
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
      title={Title}
      description={Description}
      loading={loading}
      mediaType={selectMediaType}
      apiActions={apiActions}
      changeMediaType={changeMediaType}
      datagrid={{ columns, tableData, colGroupSpan: 4, id: 'article-table' }}
      table={DataTable}
      render={['table']}
    />
  )
}

function ArticleWidget(props) {
  const { data, loading, changeMediaType, selectMediaType } = props
  const [rows, setRows] = useState([])

  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl, openMenu, closeMenu } = useMenu()

  useEffect(() => {
    setRows([])

    if (!(data && data[selectedCategory])) return

    const newData = data[selectedCategory]?.Company?.buckets.map(data => {
      const { Passing, Prominent, Headline } = data

      const total = Math.trunc(Passing?.value + Prominent?.value, Headline?.value)

      return {
        id: data.key,
        key: data.key,
        headline: Math.trunc(Headline?.value),
        passing: Math.trunc(Passing?.value),
        prominent: Math.trunc(Prominent?.value),
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
      apiActions={apiActions}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      table={DataGrid}
      datagrid={{ columns, rows }}
      render={['table']}
    />
  )
}

export default ArticleSize
