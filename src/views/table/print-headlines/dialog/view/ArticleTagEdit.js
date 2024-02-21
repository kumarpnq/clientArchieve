// src/components/print-headlines/dialog/views/ArticleTagEdit.js
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
import { updateClientTagsToCompany } from '../../../../../api/print-headlines/dialog/view/articleTagEditApi'
import Card from '@mui/material/Card'

const ArticleTagEdit = ({ articles, handleClose, token }) => {
  const [tags, setTags] = useState(articles.tags || [])

  const handleAddTag = (companyIndex, tagIndex, tag) => {
    const newTags = [...tags]
    newTags[companyIndex] = { ...(newTags[companyIndex] || {}), [`tag${tagIndex + 1}`]: tag }
    setTags(newTags)
  }

  const handleSaveDetails = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      const clientId = articles.clientId

      const companiesWithTags = articles.companies.filter((company, companyIndex) => {
        const clientTags = tags[companyIndex]

        return clientTags && Object.values(clientTags).some(tag => tag.trim() !== '')
      })

      const promises = companiesWithTags.map((company, companyIndex) => {
        const companyId = company.id
        const clientTags = tags[companyIndex] ? Object.values(tags[companyIndex]) : []

        return updateClientTagsToCompany(clientId, companyId, clientTags, storedToken)
      })

      const responses = await Promise.all(promises)
      responses.forEach(response => {
        console.log(response)
      })
    } catch (error) {
      console.error('Error saving tags:', error)
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
