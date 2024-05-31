// src/components/print-headlines/dialog/views/ArticleTagEdit.js
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

const ArticleTagEdit = ({ articles, handleClose, token, fetchTagsFlag, setFetchTagsFlag }) => {
  // const [tags, setTags] = useState(articles?.tags || [])
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

  // const handleSaveDetails = async () => {
  //   try {
  //     const storedToken = localStorage.getItem('accessToken')
  //     const clientId = articles?.clientId
  //     const socialFeedId = parseInt(articles?.socialFeedId)

  //     const companiesWithTags = articles?.companies.filter((company, companyIndex) => {
  //       const clientTags = tags[companyIndex]

  //       return clientTags && Object.values(tags).some(tag => tag.trim() !== '')
  //     })

  //     const requestData = {
  //       clientId,
  //       companyIdsAndTags: companiesWithTags.map((company, companyIndex) => {
  //         const companyId = company.id

  //         const clientTags = tags[companyIndex]
  //           ? Object.values(tags[companyIndex]).filter(tag => tag.trim() !== '')
  //           : []

  //         return { companyId, tags: clientTags }
  //       }),
  //       socialFeedId
  //     }

  //     const headers = {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${storedToken}`
  //     }

  //     const promises = companiesWithTags.map((company, companyIndex) => {
  //       return axios.post(`${BASE_URL}/updateTagsForOnlineArticle`, requestData, { headers })
  //     })

  //     const responses = await Promise.all(promises)
  //     responses.forEach(response => {
  //       console.log(response)
  //     })
  //     setFetchTagsFlag(prev => !prev)
  //     handleClose()
  //     toast.success('updated')
  //   } catch (error) {
  //     console.error('Error saving tags:', error)
  //     toast.error('something wrong')
  //   }
  // }

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
        <Typography variant='h6' align='center' sx={{ marginTop: 3 }}>
          Social Tag Edit
        </Typography>
        <Table>
          <TableBody>
            {articles?.companies.map((company, companyIndex) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                {[1, 2, 3, 4, 5].map(tagIndex => (
                  <TableCell key={tagIndex}>
                    <TextField
                      size='small'
                      label={`Tag ${tagIndex}`}
                      value={tags[`tag${tagIndex}`]}
                      onChange={e => handleAddTag(tagIndex, e.target.value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container justifyContent='flex-end' sx={{ marginTop: 2 }}>
          <Button color='primary' onClick={handleSaveDetails}>
            Save
          </Button>
          <Button color='primary' onClick={handleClose} sx={{ marginLeft: 2 }}>
            Cancel
          </Button>
        </Grid>
      </TableContainer>
    </Card>
  )
}

export default ArticleTagEdit
