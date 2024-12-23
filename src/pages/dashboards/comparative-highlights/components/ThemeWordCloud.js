import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { Print, WORD_CLOUDS } from 'src/constants/filters'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import useMenu from 'src/hooks/useMenu'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const WordCloud = dynamic(() => import('src/components/charts/WordCloud'))
const BroadWidget = dynamic(() => import('src/components/widgets/BroadWidget'))

const fontSizes = [20, 100]

function ThemeWordCloud() {
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: WORD_CLOUDS,
    mediaType: selectMediaType,
    path: `data.doc.Report.CompanyTag.FilterCompany.Company.buckets`
  })
  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const [metrics, setMetrics] = useState([])

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  const calculateFontSize = (totalFrequency, doc_count) => {
    const max = fontSizes[1]
    const value = Math.trunc((doc_count / totalFrequency) * 100) || 0

    return Math.floor((max / 100) * value)
  }

  useEffect(() => {
    setMetrics([])

    if (!(data && data[selectedCategory])) return

    const totalFrequency = data[selectedCategory]?.WordClouds?.buckets?.reduce(
      (acc, data) => (acc += data.doc_count),
      0
    )

    const newData = data[selectedCategory]?.WordClouds?.buckets?.map(data => {
      const value = calculateFontSize(totalFrequency, data.doc_count)

      return {
        text: data.key?.at(0)?.toUpperCase() + data.key?.slice(1),
        value
      }
    })

    setMetrics(newData)
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
        variant='translucent'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)'
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
      title='Theme Cloud'
      description='Keep track of companies and their reputation'
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      loading={loading}
      apiActions={apiActions}
      metrics={metrics}
      containerStyle={{ overflowY: 'auto', '& div:nth-child(2)': { height: '80% !important' } }}
      charts={{ wordCloud: { component: WordCloud, id: 'theme-word-cloud', props: { options: { fontSizes } } } }}
      render={['charts']}
    />
  )
}

export default ThemeWordCloud
