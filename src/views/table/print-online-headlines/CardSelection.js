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
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      fontSize: 13,
      maxWidth: '300px',
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.default
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
        const response = await axios.get(`${BASE_URL}/latestSocialFeedsAndArticlesForClientCompany/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })

        // Sort the companies with articles first
        const sortedCompanies = response.data.companies.sort(
          (a, b) => b.articlesAndSocialFeeds.length - a.articlesAndSocialFeeds.length
        )
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

        if (response.data && response.data.fileContent) {
          const base64Content = response.data.fileContent

          const decodedContent = atob(base64Content)

          const uint8Array = new Uint8Array(decodedContent.length)
          for (let i = 0; i < decodedContent.length; i++) {
            uint8Array[i] = decodedContent.charCodeAt(i)
          }

          const blob = new Blob([uint8Array], { type: 'application/pdf' })

          const pdfUrl = URL.createObjectURL(blob)

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

  const formatDate = rawDate => {
    const date = new Date(rawDate)
    const month = date.toLocaleString('default', { month: 'short' })
    const day = date.getDate()
    const year = date.getFullYear().toString().slice(-2)

    return `${month} ${day},${year}`
  }

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ')
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'
    }

    return text
  }

  return (
    <Card>
      <Toolbar>
        <Button startIcon={<TrendingUpIcon />} onClick={handleOpenContainer}>
          Latest Competitive News
        </Button>
      </Toolbar>
      {isContainerOpen ? (
        <>
          {loading ? (
            <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent='center' p={4}>
              {companyData.length > 0 && (
                <>
                  {companyData
                    .filter(company => company?.articlesAndSocialFeeds?.length > 0)
                    .map(company => (
                      <Grid item xs={12} sm={6} md={4} key={company.companyId}>
                        <Card sx={{ width: '100%', textAlign: 'center' }}>
                          <CardHeader title={<Typography color='primary'>{company.companyName}</Typography>} />
                          <Table>
                            <TableBody>
                              {company.articlesAndSocialFeeds.map(article => (
                                <TableRow key={article.documentId}>
                                  <TableCell sx={{ whiteSpace: '' }}>
                                    <CustomTooltip
                                      title={article.headline}
                                      arrow
                                      arrowPlacement='bottom'
                                      placement='bottom-start'
                                    >
                                      <a
                                        href={article?.link}
                                        target='_blank'
                                        style={{ textDecoration: 'none', color: '#86838b' }}
                                      >
                                        <span style={{ cursor: 'pointer' }}>{truncateText(article.headline, 10)}</span>
                                      </a>
                                    </CustomTooltip>
                                    <br />
                                    {`${article.publication} -  (${formatDate(article.date)})`}
                                    {loadingArticleId === article.articleId && <CircularProgress size={17} />}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Card>
                      </Grid>
                    ))}
                </>
              )}
            </Grid>
          )}
          <Box display='flex' justifyContent='center' pb={4}>
            <Button color='primary' onClick={handleCloseContainer}>
              Close
            </Button>
          </Box>
        </>
      ) : null}
    </Card>
  )
}

export default CardSelection
