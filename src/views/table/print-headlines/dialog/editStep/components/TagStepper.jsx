// ArticleTagEdit.js
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import useUpdateClientTagsToCompanyForArticles from 'src/api/print-headlines/tags/useUpdateClientTagsToCompanyForArticles'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import useGetTagsForArticle from 'src/api/print-headlines/tags/useGetTagsForArticle'

// * third party imports
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import axios from 'axios'
import { ELASTIC_SERVER } from 'src/api/base'
import { Divider } from '@mui/material'

const TagStepper = ({ articles, handleClose, fetchTags, setFetchTags, token, fetchTagsFlag, setFetchTagsFlag }) => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const companyId = articles?.companies.map(i => i.id).join()
  const articleId = articles.articleId
  const [fetchFlag, setFetchFlag] = useState(false)
  const [value, setValue] = useState(0)

  // const {
  //   tagsData,
  //   loading: fetchLoading,
  //   error: fetchError
  // } = useGetTagsForArticle({
  //   articleId,
  //   clientId,
  //   companyIds: companyId,
  //   fetchFlag
  // })

  const { postData, errorMessage } = useUpdateClientTagsToCompanyForArticles()

  const [tags, setTags] = useState({})

  useEffect(() => {
    setFetchTagsFlag(prev => !prev)
  }, [fetchFlag, value, setFetchTagsFlag])

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
    setFetchFlag(!fetchFlag)
  }, [])

  const handleSaveDetails = async () => {
    try {
      const companyIdsAndTags = Object.keys(tags).map(companyId => ({
        companyId,
        tags: Object.values(tags[companyId] || {}).filter(tag => tag.trim() !== '')
      }))
      postData({
        clientId,
        companyIdsAndTags,
        articleId
      })

      const elasticRequestData = {
        clientId,
        companyIdsAndTags,
        articleId: articleId,
        articleType: 'print'
      }

      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`
      }

      const elasticResponse = await axios.put(
        `${ELASTIC_SERVER}/api/v1/internals/updateSingleArticleTags`,
        elasticRequestData,
        {
          headers
        }
      )

      setFetchFlag(!fetchFlag)

      setValue(value + 1)
      handleClose()
      setFetchTags(fetchTags + 1)
      if (errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.success('updated')
        setFetchTagsFlag(prev => !prev)
      }
    } catch (error) {
      console.log(error)

      toast.error('something wrong')
    }
  }

  return (
    <Box>
      <Box>
        {articles?.companies?.map((company, companyIndex) => {
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
        <Button color='primary' onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
        <Button
          onClick={handleSaveDetails}
          variant='outlined'
          sx={{ ml: 1, bgcolor: 'primary.main', color: 'text.secondary' }}
        >
          Save
        </Button>
      </Grid>
    </Box>
  )
}

export default TagStepper
