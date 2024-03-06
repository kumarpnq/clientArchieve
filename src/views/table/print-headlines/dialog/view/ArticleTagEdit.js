// ArticleTagEdit.js
import React, { useState } from 'react'
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
import useUpdateClientTagsToCompanyForArticles from 'src/api/print-headlines/tags/useupdateClientTagsToCompanyForArticles'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const ArticleTagEdit = ({ articles, handleClose, token }) => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [tags, setTags] = useState(articles.tags || [])
  const companyId = articles.companies.map(i => i.id).join()
  const articleId = articles.articleId
  const tagsForPost = tags.length > 0 && tags.flatMap(Object.values)

  const postData = useUpdateClientTagsToCompanyForArticles()

  const handleAddTag = (companyIndex, tagIndex, tag) => {
    const newTags = [...tags]
    newTags[companyIndex] = { ...(newTags[companyIndex] || {}), [`tag${tagIndex + 1}`]: tag }
    setTags(newTags)
  }

  const handleSaveDetails = () => {
    try {
      postData({
        clientId,
        companyId,
        tagsForPost,
        articleId
      })

      handleClose()
    } catch (error) {
      // Handle error state
      console.error('Error:', error)
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
            {articles.companies.map((company, companyIndex) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                {[1, 2, 3, 4, 5].map(tagIndex => (
                  <TableCell key={tagIndex}>
                    <TextField
                      size='small'
                      label={`Tag ${tagIndex}`}
                      value={(tags[companyIndex] && tags[companyIndex][`tag${tagIndex}`]) || ''}
                      onChange={e => handleAddTag(companyIndex, tagIndex - 1, e.target.value)}
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
