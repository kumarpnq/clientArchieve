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
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

const ArticleCountDistribution = ({ companyData }) => {
  const sliderRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [slidesToShow, setSlidesToShow] = useState(3)

  const totalTables = Math.ceil(companyData.length / slidesToShow)

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    responsive: [
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
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
      const newSlidesToShow = width < 650 ? 1 : width < 850 ? 2 : 3

      if (slidesToShow !== newSlidesToShow) {
        setSlidesToShow(newSlidesToShow)

        // Update the current page based on the new slidesToShow
        const newTotalTables = Math.ceil(companyData.length / newSlidesToShow)
        setCurrentPage(prevPage => Math.min(prevPage, newTotalTables))
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [slidesToShow, companyData.length])

  const handleNext = () => {
    sliderRef.current.slickNext()
    setCurrentPage(prev => prev + 1)
  }

  const handlePrev = () => {
    sliderRef.current.slickPrev()
    setCurrentPage(prev => prev - 1)
  }

  return (
    <Card>
      <CardHeader title={`Article Count Distribution`} />
      <CardContent>
        <Slider ref={sliderRef} {...settings}>
          {companyData.map((company, index) => (
            <Grid key={company.company} lg={11}>
              <Box mx={2} width='100%'>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{company.company}</TableCell>
                        <TableCell>Overall</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Today</TableCell>
                        <TableCell>{company.articleCount.today}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Week</TableCell>
                        <TableCell>{company.articleCount.lastWeek}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Month</TableCell>
                        <TableCell>{company.articleCount.lastMonth}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Three Months</TableCell>
                        <TableCell>{company.articleCount.lastThreeMonths}</TableCell>
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
          } of ${companyData.length}`}</span>
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
