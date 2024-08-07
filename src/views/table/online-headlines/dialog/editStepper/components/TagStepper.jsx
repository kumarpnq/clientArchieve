import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Card from '@mui/material/Card'
import { updateClientTagsToCompany } from 'src/api/print-headlines/dialog/view/articleTagEditApi'
import { BASE_URL } from 'src/api/base'
import axios from 'axios'
import toast from 'react-hot-toast'
import useGetTagsForArticle from 'src/api/online-headline/tag/useGetTagsForArtcile'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box, Divider } from '@mui/material'

const TagStepper = ({ articles, handleClose, token, fetchTagsFlag, setFetchTagsFlag }) => {
  const articleId = articles?.socialFeedId
  const clientId = articles?.clientId
  const companyId = articles?.companies.map(i => i.id).join()

  const [value, setValue] = useState(0)
  const [fetchFlag, setFetchFlag] = useState(false)

  const [tags, setTags] = useState({
    tag1: '',
    tag2: '',
    tag3: '',
    tag4: '',
    tag5: ''
  })

  const {
    tagsData,
    loading: fetchLoading,
    error: fetchError
  } = useGetTagsForArticle({
    articleId,
    clientId,
    companyIds: companyId,
    fetchFlag
  })

  useEffect(() => {
    setFetchTagsFlag(prev => !prev)
  }, [fetchFlag, value])

  useEffect(() => {
    // Use the first company's data in tagsData or default to an empty object
    const companyTagsData = tagsData[0] || { tags: [] }

    setTags(prevTags => ({
      ...prevTags,
      tag1: companyTagsData.tags[0] || '',
      tag2: companyTagsData.tags[1] || '',
      tag3: companyTagsData.tags[2] || '',
      tag4: companyTagsData.tags[3] || '',
      tag5: companyTagsData.tags[4] || ''
    }))
  }, [tagsData])

  const handleAddTag = (tagIndex, tag) => {
    setTags(prevTags => ({
      ...prevTags,
      [`tag${tagIndex}`]: tag
    }))
  }

  useEffect(() => {
    setFetchFlag(!fetchFlag)
  }, [])

  const handleSaveDetails = async () => {
    const storedToken = localStorage.getItem('accessToken')
    const clientId = articles?.clientId
    const socialFeedId = parseInt(articles?.socialFeedId)
    const companyId = articles?.companies.map(i => i.id).join()
    const tagsForPost = Object.values(tags).filter(tag => tag.trim() !== '')

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`
      }

      const requestData = {
        clientId,
        companyIdsAndTags: [
          {
            companyId: companyId,
            tags: tagsForPost
          }
        ],
        socialFeedId
      }

      await axios.post(`${BASE_URL}/updateTagsForOnlineArticle`, requestData, { headers })
      setFetchTagsFlag(prev => !prev)
      handleClose()
      toast.success('updated')
    } catch (error) {
      console.log(error.message || error.response?.data || error)
      toast.error('something wrong')
    }
  }

  return (
    <Card>
      <TableContainer component={Paper}>
        <Box>
          {articles.companies.map((company, companyIndex) => {
            const companyTagsData = tagsData.find(data => data.companyId === company.id) || { tags: [] }

            return (
              <Box key={company.id} mb={3}>
                <Box mb={1} fontWeight='fontWeightBold'>
                  {company.name}
                </Box>
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5].map(tagIndex => (
                    <Grid item key={tagIndex} xs={12} sm={6} md={4} lg={2}>
                      <CustomTextField
                        size='small'
                        label={`Tag ${tagIndex}`}
                        value={tags[`tag${tagIndex}`]}
                        onChange={e => handleAddTag(tagIndex, e.target.value)}
                        fullWidth
                      />
                    </Grid>
                  ))}
                </Grid>
                {companyIndex < articles.companies.length - 1 && <Divider sx={{ mt: 1 }} />}
              </Box>
            )
          })}
        </Box>
        <Grid container justifyContent='flex-end' sx={{ marginTop: 2 }}>
          <Button color='primary' variant='outlined' onClick={handleClose} sx={{ marginLeft: 2 }}>
            Cancel
          </Button>
          <Button
            variant='outlined'
            sx={{ bgcolor: 'primary.main', color: 'text.primary', ml: 2 }}
            onClick={handleSaveDetails}
          >
            Save
          </Button>
        </Grid>
      </TableContainer>
    </Card>
  )
}

export default TagStepper
