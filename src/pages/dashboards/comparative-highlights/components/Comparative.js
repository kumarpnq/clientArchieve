import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import MixedChart from 'src/components/charts/MixedChart'
import Widget from 'src/components/Widget'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { All, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'

function Comparative(props) {
  const { openMenu, height } = props
  const [mediaType, setMediaType] = useState(All)
  const { data, loading } = useChartAndGraphApi(VISIBILITY_IMAGE_SCORE, mediaType)

  const changeMediaType = (event, newValue) => {
    setMediaType(newValue)
  }

  return (
    <Widget
      title='Comparative Key Highlights'
      openMenu={openMenu}
      loading={loading}
      data={data}
      mediaType={mediaType}
      height={height}
      changeMediaType={changeMediaType}
      charts={{
        bar: { component: MixedChart }
      }}
      table={
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  { title: 'Company', width: 130, align: 'left' },
                  { title: 'V Score', width: 100, align: 'center' },
                  { title: 'I Score', width: 100, align: 'center' },
                  { title: 'QE', width: 100, align: 'center' }
                ].map(col => (
                  <TableCell key={col.title} style={{ minWidth: col.width }} align={col.align}>
                    {col.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map(d => (
                <TableRow key={d.key} hover sx={{ cursor: 'pointer' }}>
                  <TableCell component='th' scope='row'>
                    {d.key}
                  </TableCell>

                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(d.V_Score.value)}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(d.I_Score.value)}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(d.QE.value)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    />
  )
}

export default Comparative
