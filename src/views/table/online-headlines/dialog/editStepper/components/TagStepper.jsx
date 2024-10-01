import React, { useEffect, useState } from 'react'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

import TableContainer from '@mui/material/TableContainer'

import Card from '@mui/material/Card'

import { BASE_URL, ELASTIC_SERVER } from 'src/api/base'
import axios from 'axios'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import { Box, CircularProgress, Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const TagStepper = ({ articles, handleClose, token, fetchTagsFlag, setFetchTagsFlag }) => {
  const articleId = articles?.socialFeedId
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const companyId = articles?.companies.map(i => i.id).join()

  const [value, setValue] = useState(0)
  const [fetchFlag, setFetchFlag] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  const [tags, setTags] = useState({})

  useEffect(() => {
    setFetchTagsFlag(prev => !prev)
  }, [fetchFlag, value])

  const handleAddTag = (tagIndex, company, tag) => {
    setTags(prevTags => ({
      ...prevTags,
      [company.id]: {
        ...prevTags[company.id],
        [`tag${tagIndex}`]: tag
      }
    }))
  }

  useEffect(() => {
    const initialTags = {}
    articles.companies.forEach(company => {
      const companyTags = company.tags?.[0]?.tags || []
      initialTags[company.id] = {
        tag1: companyTags[0] || '',
        tag2: companyTags[1] || '',
        tag3: companyTags[2] || '',
        tag4: companyTags[3] || '',
        tag5: companyTags[4] || ''
      }
    })
    setTags(initialTags)
  }, [articles])

  useEffect(() => {
    setFetchFlag(!fetchFlag)
  }, [])

  const handleSaveDetails = async () => {
    const storedToken = localStorage.getItem('accessToken')
    const socialFeedId = parseInt(articles?.socialFeedId)

    try {
      setUpdateLoading(true)

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`
      }

      const companyIdsAndTags = Object.keys(tags).map(companyId => ({
        companyId,
        tags: Object.values(tags[companyId] || {}).filter(tag => tag.trim() !== '')
      }))

      const requestData = {
        clientId,
        companyIdsAndTags,
        socialFeedId
      }

      const elasticRequestData = {
        clientId,
        companyIdsAndTags,
        articleId: socialFeedId,
        articleType: 'online'
      }

      const fastAPIResponse = await axios.post(`${BASE_URL}/updateTagsForOnlineArticle`, requestData, { headers })

      const elasticResponse = await axios.put(
        `${ELASTIC_SERVER}/api/v1/internals/updateSingleArticleTags`,
        elasticRequestData,
        {
          headers
        }
      )
      if (fastAPIResponse.status === 200 && elasticResponse.status === 200) {
        setFetchTagsFlag(prev => !prev)
        handleClose()
        toast.success('updated')
      }
    } catch (error) {
      console.log(error.message || error.response?.data || error)
      toast.error('something wrong')
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <Card>
      <TableContainer component={Paper}>
        <Box>
          {articles.companies.map((company, companyIndex) => {
            const companyTags = tags[company.id] || {}

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
                        value={companyTags[`tag${tagIndex}`] || ''}
                        onChange={e => handleAddTag(tagIndex, company, e.target.value)}
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
            sx={{
              bgcolor: !updateLoading ? 'primary.main' : '',
              color: 'text.primary',
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={handleSaveDetails}
          >
            {updateLoading && <CircularProgress size={'1em'} />}
            Save
          </Button>
        </Grid>
      </TableContainer>
    </Card>
  )
}

export default TagStepper
