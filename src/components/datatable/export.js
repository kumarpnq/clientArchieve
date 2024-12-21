import * as XLSX from 'xlsx'

const prepareColumnGroupTable = tableData => {
  // Initialize the worksheet data
  const wsData = []

  // Add headers
  const headers = ['Company']
  tableData.columnGroup.forEach(group => {
    tableData.columnFields.forEach(colField => {
      headers.push(`${group} - ${colField.headerName}`)
    })
  })
  wsData.push(headers)

  // Add data rows
  tableData.rows.forEach((company, rowIndex) => {
    const row = [company]

    // For each column group
    tableData.columnGroup.forEach((_, colIndex) => {
      // For dynamic column field
      tableData.columnFields.forEach(colField => {
        row.push(tableData[colField.field]?.[colIndex]?.[rowIndex] || 0)
      })
    })

    wsData.push(row)
  })

  return wsData
}

const prepareTable = tableData => {
  // Initialize the worksheet data
  const wsData = []

  // Add headers
  const headers = []

  tableData.columns.forEach(colField => {
    headers.push(colField.headerName)
  })

  wsData.push(headers)

  // Add data rows
  tableData.rows.forEach((company, rowIndex) => {
    const row = [company]

    // For dynamic column field
    tableData.columns.slice(1).forEach(colField => {
      row.push(tableData[colField.field]?.[rowIndex] || 0)
    })

    wsData.push(row)
  })

  return wsData
}

export const exportColumnGroupTable = (tableData, format = 'xlsx', fileName = document.title) => {
  if (!tableData.rows.length && !tableData.columnGroup.length) return

  const exportData = prepareColumnGroupTable(tableData)

  switch (format.toLowerCase()) {
    case 'xlsx': {
      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws)
      XLSX.writeFile(wb, `${fileName}.xlsx`)
      break
    }

    case 'csv': {
      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.csv`
      link.click()
      URL.revokeObjectURL(link.href)
      break
    }

    case 'json': {
      // Convert array of arrays to array of objects
      const [headers, ...rows] = exportData

      const jsonData = rows.map(row => {
        const obj = {}
        headers.forEach((header, index) => {
          obj[header] = row[index]
        })

        return obj
      })

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.json`
      link.click()
      URL.revokeObjectURL(link.href)
      break
    }

    default:
      console.error('Unsupported format:', format)
  }
}

export const exportTable = (tableData, format = 'xlsx', fileName = document.title) => {
  if (!tableData.rows.length) return

  const exportData = prepareTable(tableData)

  switch (format.toLowerCase()) {
    case 'xlsx': {
      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws)
      XLSX.writeFile(wb, `${fileName}.xlsx`)
      break
    }

    case 'csv': {
      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.csv`
      link.click()
      URL.revokeObjectURL(link.href)
      break
    }

    case 'json': {
      // Convert array of arrays to array of objects
      const [headers, ...rows] = exportData

      const jsonData = rows.map(row => {
        const obj = {}
        headers.forEach((header, index) => {
          obj[header] = row[index]
        })

        return obj
      })

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.json`
      link.click()
      URL.revokeObjectURL(link.href)
      break
    }

    default:
      console.error('Unsupported format:', format)
  }
}
