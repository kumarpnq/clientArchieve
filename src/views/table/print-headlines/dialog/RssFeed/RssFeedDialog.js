import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {
  Box,
  Button,
  Paper,
  Typography,
  TextareaAutosize,
  DialogContentText,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material'
import xmlJs from 'xml-js'
import WarningIcon from '@mui/icons-material/Warning'
import { useTheme } from '@mui/material/styles'

const RssFeedDialog = ({ open, handleClose, selectedArticles }) => {
  const theme = useTheme()
  const [feedType, setFeedType] = useState('xml') // Default to XML feed
  //style={{ backgroundColor: theme.palette.primary.main, color: 'white', textAlign: 'center' }}

  // Check if selectedArticles is null or empty
  if (!selectedArticles || selectedArticles.length === 0) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <WarningIcon style={{ marginRight: '8px' }} />
          Please Select At Least One Article
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ textAlign: 'center', marginBottom: '16px' }}>
            To generate an RSS feed, you must select at least one article.
          </DialogContentText>
          <Box display='flex' justifyContent='center'>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  // If selectedArticles is not null or empty, proceed with generating the XML or JSON content
  const generateXML = () => {
    const xmlOptions = { compact: true, ignoreComment: true, spaces: 4 }

    const xmlContent = selectedArticles.map((article, index) => {
      console.log('checkingxml==>', article)
      // Remove unwanted elements from the article object
      const { articleId, clientId, ...filteredArticle } = article

      const articleObj = {}
      Object.keys(filteredArticle).forEach(key => {
        if (filteredArticle[key] !== undefined) {
          // Check if the value is not undefined
          articleObj[key] = { _text: filteredArticle[key] }
        }
      })

      const articleXmlString = xmlJs.js2xml({ article: articleObj }, xmlOptions)

      // Add a divider if it's not the first article
      return index === 0 ? articleXmlString : `\n\n<!-- Divider between articles -->\n\n${articleXmlString}`
    })

    // Combine all articles
    return `<?xml version="1.0" encoding="UTF-8" ?>
  ${xmlContent.join('\n\n')}`
  }

  const generateJSON = () => {
    if (selectedArticles.length === 1) {
      // Only one article, no need for dividers
      const { articleId, ...filteredArticle } = selectedArticles[0]

      return JSON.stringify(filteredArticle, null, 2)
    }

    const jsonContent = selectedArticles.map((article, index) => {
      const { articleId, clientId, ...filteredArticle } = article
      const articleJsonString = JSON.stringify(filteredArticle, null, 2)

      // Add a divider if it's not the first article
      return index === 0 ? articleJsonString : `\n\n// Divider between articles\n\n${articleJsonString}`
    })

    // Combine all articles
    return `[${jsonContent.join(',')}]`
  }

  const getContent = () => {
    return feedType === 'xml' ? generateXML() : generateJSON()
  }

  const xmlContent = generateXML()
  const jsonContent = generateJSON()
  const contentToShow = getContent()

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle color='primary'>
        RSS Feed
        <RadioGroup row value={feedType} onChange={e => setFeedType(e.target.value)} style={{ marginLeft: '20px' }}>
          <FormControlLabel value='xml' control={<Radio />} label='XML' />
          <FormControlLabel value='json' control={<Radio />} label='JSON' />
        </RadioGroup>
      </DialogTitle>
      <Box p={2}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant='body1' component='div'>
            This XML file does not appear to have any style information associated with it. The document tree is shown
            below.
          </Typography>

          <TextareaAutosize
            value={contentToShow}
            readOnly
            style={{ width: '100%', minHeight: '300px', fontSize: '14px', marginTop: '8px' }}
          />
          <Box mt={2} textAlign='right'>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  )
}

export default RssFeedDialog
