// ArticleTagEdit.js
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
import useUpdateClientTagsToCompanyForArticles from 'src/api/print-headlines/tags/useUpdateClientTagsToCompanyForArticles'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import useGetTagsForArticle from 'src/api/print-headlines/tags/useGetTagsForArticle'

// * third party imports
import toast from 'react-hot-toast'

const ArticleTagEdit = ({ articles, handleClose, token, fetchTagsFlag, setFetchTagsFlag }) => {
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

  const postData = useUpdateClientTagsToCompanyForArticles()

  const [tags, setTags] = useState({
    tag1: '',
    tag2: '',
    tag3: '',
    tag4: '',
    tag5: ''
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
      setFetchTagsFlag(prev => !prev)
      setValue(value + 1)
      handleClose()

      toast.success('updated')
    } catch (error) {
      console.log(error)

      toast.error('something wrong')
    }
  }

  return (
    <Card>
      <TableContainer component={Paper}>
        <Typography variant='h6' align='center' sx={{ marginTop: 3 }}>
          Article Tag Edit
        </Typography>
        <Table>
          <TableBody>
            {articles.companies.map((company, companyIndex) => {
              const companyTagsData = tagsData.find(data => data.companyId === company.id) || { tags: [] }

              return (
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
              )
            })}
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
