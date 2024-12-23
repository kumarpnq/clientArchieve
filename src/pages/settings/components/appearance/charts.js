import styled from '@emotion/styled'
import { Box, Card, Grid, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import BarChart from 'src/components/charts/BarChart'
import DoughnutChart from 'src/components/charts/DoughnutChart'
import Colors from 'src/data/colors'
import data from 'src/data/data.json'
import { getChartColor, setChartColor } from 'src/store/apps/preference/preferenceSlice'
import RainbowImage from 'public/images/rainbow.png'
import Image from 'next/image'

// import { generateMonochromePalette } from 'src/lib/chroma'

const ColorIcon = styled(Box)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: 1000
}))

function Charts() {
  const ChartColors = useSelector(getChartColor)
  const dispatch = useDispatch()

  const selectColor = (name, colors) => dispatch(setChartColor({ name, colors }))

  return (
    <Stack>
      <Grid container my={4} spacing={4}>
        <Grid item xs={12} md={6} lg={7} xl={8}>
          <Typography variant='h4' fontWeight={600} gutterBottom>
            Customization
          </Typography>
          <Typography variant='h6' color='text.secondary'>
            Color palette
          </Typography>
          <Stack direction='row' spacing={3} my={3}>
            {Object.keys(Colors.shades).map(color => (
              <IconButton
                key={color}
                onClick={() => selectColor(color, Colors.shades[color])}
                sx={{
                  alignItems: 'center',
                  padding: 0.8,
                  border: '2px solid',
                  borderColor: ChartColors.name === color ? Colors.shades[color].at(2) : 'transparent'
                }}
              >
                <ColorIcon bgcolor={Colors.shades[color].at(2)} />
              </IconButton>
            ))}
          </Stack>

          <Typography variant='h6' color='text.secondary'>
            Multi Colors
          </Typography>
          <Stack direction='row' spacing={3} my={3}>
            {Object.keys(Colors.multiColors).map(color => (
              <IconButton
                key={color}
                onClick={() => selectColor(color, Colors.multiColors[color])}
                sx={{
                  padding: 0.8,
                  border: '2px solid',
                  borderColor: ChartColors.name === color ? Colors.multiColors[color].at(2) : 'transparent'
                }}
              >
                <Image src={RainbowImage} style={{ width: 30, height: 30 }} alt='rainbow' />
              </IconButton>
            ))}
          </Stack>
          <Typography variant='h6' color='text.secondary'>
            Monochrome
          </Typography>
          <Stack direction='row' spacing={3} my={3}>
            {Object.keys(Colors.monochrome).map(color => (
              <IconButton
                key={color}
                onClick={() => selectColor(color, Colors.monochrome[color])}
                sx={{
                  alignItems: 'center',
                  padding: 0.8,
                  border: '2px solid',
                  borderColor: ChartColors.name === color ? Colors.monochrome[color].at(2) : 'transparent'
                }}
              >
                <ColorIcon bgcolor={Colors.monochrome[color].at(2)} />
              </IconButton>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} lg={5} xl={4}>
          <Card sx={{ minHeight: 350, p: 4, mb: 2 }}>
            <BarChart metrics={{ labels: data.data.labels, bar: data.data.metrics }} />
          </Card>
          <Card sx={{ minHeight: 350, p: 4 }}>
            <DoughnutChart
              metrics={{ labels: data.data.labels, data: data.data.metrics['Cost'] }}
              cutout='80%'
              radius='85%'
            />
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Charts
