import React, { useState, useEffect } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CircularProgress from '@mui/material/CircularProgress'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

// ** Tooltip
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/system'
import { tooltipClasses } from '@mui/material/Tooltip'
import { BASE_URL } from 'src/api/base'

// Your CustomTooltip component
const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default, // Use default background color for dark theme
      color: theme.palette.text.primary, // Use primary text color for dark theme
      boxShadow: theme.shadows[1],
      fontSize: 13,
      maxWidth: '300px', // Set the maximum width for better readability
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.default // Use default background color for the arrow in dark theme
      }
    }
  })
)

const CardSelection = () => {
  const [isContainerOpen, setContainerOpen] = useState(false)
  const [companyData, setCompanyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingArticleId, setLoadingArticleId] = useState(null)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const fetchLatestArticlesForCompetition = async () => {
    try {
      setLoading(true)
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        const response = await axios.get(`${BASE_URL}/latestArticlesAndSocialFeedForClientCompany/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })

        // Sort the companies with articles first
        const sortedCompanies = response.data.companies.sort((a, b) => b.articles.length - a.articles.length)
        setCompanyData(sortedCompanies)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReadArticleFile = async (articleId, fileType) => {
    try {
      setLoadingArticleId(articleId)
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        const request_params = {
          articleId: articleId,
          fileType: fileType
        }

        const response = await axios.get(`${BASE_URL}/readArticleFile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params,
          responseType: 'json'
        })

        // Check if the response contains valid content
        if (response.data && response.data.fileContent) {
          const base64Content = response.data.fileContent

          // Decode the base64 content
          const decodedContent = atob(base64Content)

          // Convert the decoded content to Uint8Array
          const uint8Array = new Uint8Array(decodedContent.length)
          for (let i = 0; i < decodedContent.length; i++) {
            uint8Array[i] = decodedContent.charCodeAt(i)
          }

          // Create a Blob from Uint8Array
          const blob = new Blob([uint8Array], { type: 'application/pdf' })

          // Create a Blob URL for the PDF
          const pdfUrl = URL.createObjectURL(blob)

          // Open the PDF in a new tab
          window.open(pdfUrl, '_blank')
        } else {
          console.log('Empty or invalid content in the response.')
        }
      }
    } catch (error) {
      console.error('Error fetching read Article File:', error)
    } finally {
      setLoadingArticleId(null)
    }
  }

  const handleOpenContainer = () => {
    fetchLatestArticlesForCompetition()
    setContainerOpen(true)
  }

  useEffect(() => {
    fetchLatestArticlesForCompetition()
  }, [clientId])

  const handleCloseContainer = () => {
    setContainerOpen(false)
    setLoading(true)
  }

  // Function to format the date (Feb 14,24)
  const formatDate = rawDate => {
    const date = new Date(rawDate)
    const month = date.toLocaleString('default', { month: 'short' })
    const day = date.getDate()
    const year = date.getFullYear().toString().slice(-2) // Get the last two digits of the year

    return `${month} ${day},${year}`
  }

  return (
    <Card>
      <Toolbar>
        <Button
          startIcon={<TrendingUpIcon />} // Icon placed inside the button
          onClick={handleOpenContainer}
        >
          Latest Competitive News
        </Button>
      </Toolbar>

      {isContainerOpen && (
        <>
          {loading ? (
            <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent='center' p={4}>
              {companyData.map(company => (
                <Grid item xs={12} sm={6} md={4} key={company.companyId}>
                  <Card sx={{ width: '100%', textAlign: 'center' }}>
                    <CardHeader title={<Typography color='primary'>{company.companyName}</Typography>} />{' '}
                    {company.articles.length > 0 ? (
                      <Table>
                        <TableBody>
                          {company.articles.map(article => (
                            <TableRow key={article.articleId}>
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                <CustomTooltip
                                  title={article.headline}
                                  arrow
                                  arrowPlacement='bottom'
                                  placement='bottom-start' // Adjust the placement as needed
                                >
                                  <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => fetchReadArticleFile(article.articleId, 'pdf')}
                                  >
                                    {article.headline}
                                  </span>
                                </CustomTooltip>
                                <br />
                                {`${article.publication} -  (${formatDate(article.articleDate)})`}
                                {loadingArticleId === article.articleId && <CircularProgress size={17} />}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography variant='body1'>No articles available</Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Box display='flex' justifyContent='center' pb={4}>
            <Button color='primary' onClick={handleCloseContainer}>
              Close
            </Button>
          </Box>
        </>
      )}
    </Card>
  )
}

export default CardSelection
