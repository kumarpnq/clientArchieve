import React, { useRef, useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DownloadIcon from '@mui/icons-material/Download'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import * as XLSX from 'xlsx'
import usePrintArticleCountDistribution from 'src/api/dashboard-online/articleCountDistributionAPI'

const ArticleCountDistribution = () => {
  const printArticleCountDistribution = usePrintArticleCountDistribution()
  const sliderRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [slidesToShow, setSlidesToShow] = useState(2) // Change this to 2 for two columns
  const totalTables = Math.ceil(printArticleCountDistribution.length / slidesToShow)

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    responsive: [
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const newSlidesToShow = width < 650 ? 1 : 2

      if (slidesToShow !== newSlidesToShow) {
        setSlidesToShow(newSlidesToShow)

        // Update the current page based on the new slidesToShow
        const newTotalTables = Math.ceil(printArticleCountDistribution?.length / newSlidesToShow)
        setCurrentPage(prevPage => Math.min(prevPage, newTotalTables))
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [slidesToShow, printArticleCountDistribution.length])

  const handleNext = () => {
    sliderRef.current.slickNext()
    setCurrentPage(prev => prev + 1)
  }

  const handlePrev = () => {
    sliderRef.current.slickPrev()
    setCurrentPage(prev => prev - 1)
  }

  const handleDownload = () => {
    if (printArticleCountDistribution && printArticleCountDistribution.length > 0) {
      const flattenData = printArticleCountDistribution.map(item => {
        return {
          'Company ID': item.company.id,
          'Company Name': item.company.name,
          'Tier 1 Today': item.countTier1.today,
          'Tier 1 Last Week': item.countTier1.lastWeek,
          'Tier 1 Last Month': item.countTier1.lastMonth,
          'Tier 1 Last Three Months': item.countTier1.lastThreeMonth,
          'Overall Today': item.countOverall.today,
          'Overall Last Week': item.countOverall.lastWeek,
          'Overall Last Month': item.countOverall.lastMonth,
          'Overall Last Three Months': item.countOverall.lastThreeMonth
        }
      })

      if (flattenData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(flattenData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
        XLSX.writeFile(wb, 'exported_data.xlsx')
      } else {
        console.error('No valid data is available for download.')
      }
    } else {
      console.error('Data is not available for download.')
    }
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardHeader title={`Article Count Distribution`} />
        <IconButton onClick={handleDownload} disabled={printArticleCountDistribution?.length <= 0}>
          <DownloadIcon />
        </IconButton>
      </Box>
      <CardContent>
        <Slider ref={sliderRef} {...settings}>
          {printArticleCountDistribution.map(article => (
            <Grid key={article.company.id} lg={11}>
              <Box mx={2} width='100%'>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{article.company.name}</TableCell>
                        <TableCell>Tier 1</TableCell>
                        <TableCell>Overall</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Today</TableCell>
                        <TableCell>{article.countTier1.today}</TableCell>
                        <TableCell>{article.countOverall.today}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Week</TableCell>
                        <TableCell>{article.countTier1.lastWeek}</TableCell>
                        <TableCell>{article.countOverall.lastWeek}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Month</TableCell>
                        <TableCell>{article.countTier1.lastMonth}</TableCell>
                        <TableCell>{article.countOverall.lastMonth}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Three Months</TableCell>
                        <TableCell>{article.countTier1.lastThreeMonth}</TableCell>
                        <TableCell>{article.countOverall.lastThreeMonth}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          ))}
        </Slider>
        <Box display='flex' justifyContent='flex-end' alignItems='center' marginTop='16px'>
          <span style={{ margin: '0 10px' }}>{`Tables ${slidesToShow * (currentPage - 1) + 1} - ${
            slidesToShow * currentPage
          } of ${printArticleCountDistribution.length}`}</span>
          <IconButton onClick={handlePrev} disabled={currentPage === 1}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNext} disabled={currentPage === totalTables}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ArticleCountDistribution
