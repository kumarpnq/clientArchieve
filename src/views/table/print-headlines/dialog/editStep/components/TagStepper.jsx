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

const TagStepper = ({ articles, handleClose, fetchTags, setFetchTags, token, fetchTagsFlag, setFetchTagsFlag }) => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const companyId = articles?.companies.map(i => i.id).join()
  const articleId = articles.articleId
  const [fetchFlag, setFetchFlag] = useState(false)
  const [value, setValue] = useState(0)

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

  const { postData, errorMessage } = useUpdateClientTagsToCompanyForArticles()

  const [tags, setTags] = useState({
    tag1: '',
    tag2: '',
    tag3: '',
    tag4: '',
    tag5: ''
  })

  useEffect(() => {
    setFetchTagsFlag(prev => !prev)
  }, [fetchFlag, value, setFetchTagsFlag])

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

  const handleSaveDetails = () => {
    try {
      const tagsForPost = Object.values(tags).filter(tag => tag.trim() !== '')
      postData({
        clientId,
        companyId,
        tagsForPost,
        articleId
      })
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
      toast.error('something wrong')
    }
  }

  return (
    <Box>
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
