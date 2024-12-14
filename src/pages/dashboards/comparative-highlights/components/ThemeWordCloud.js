import React, { useEffect, useState } from 'react'
import { Print, WORD_CLOUDS } from 'src/constants/filters'
import BroadWidget from 'src/components/widgets/BroadWidget'
import WordCloud from 'src/components/charts/WordCloud'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import useMenu from 'src/hooks/useMenu'

const fontSizes = [16, 100]

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
    if (!(data && data[selectedCategory])) return

    const totalFrequency = data[selectedCategory]?.WordClouds?.buckets?.reduce(
      (acc, data) => (acc += data.doc_count),
      0
    )

    const newData = data[selectedCategory]?.WordClouds?.buckets?.map(data => {
      const value = calculateFontSize(totalFrequency, data.doc_count)

      return {
        text: data.key,
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
      title='Theme Cloud'
      description='Keep track of companies and their reputation'
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      render={['charts']}
      loading={loading}
      apiActions={apiActions}
      metrics={metrics}
      charts={{ wordCloud: { component: WordCloud, props: { options: { fontSizes } } } }}
    />
  )
}

export default ThemeWordCloud
