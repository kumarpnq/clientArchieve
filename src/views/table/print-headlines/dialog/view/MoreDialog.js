//MoreDialog.js

import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import FullScreenJPGDialog from './FullScreenJPGDialog'
import FullScreenHTMLDialog from './FullScreenHTMLDialog'
import FullScreenPDFDialog from './FullScreenPDFDialog'
import FullScreenEditDetailsDialog from './FullScreenEditDetailsDialog'
import { BASE_URL } from 'src/api/base'

const ViewDialog = ({ open, handleClose, articles }) => {
  const [jpgDialogOpen, setJpgDialogOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfSrc, setPdfSrc] = useState('')
  const [editDetailsDialogOpen, setEditDetailsDialogOpen] = useState(false)

  const fetchReadArticleFile = async fileType => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      if (storedToken) {
        const request_params = {
          articleId: articles.articleId,
          fileType: fileType
        }

        const response = await axios.get(`${BASE_URL}/readArticleFile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params,
          responseType: 'json' // Set the responseType to 'json'
        })

        // Check if the response contains valid content
        if (response.data && response.data.fileContent) {
          if (fileType === 'jpg') {
            const imageSrc = `data:image/jpeg;base64,${response.data.fileContent}`
            setImageSrc(imageSrc)
          } else if (fileType === 'pdf') {
            const pdfSrc = `data:application/pdf;base64,${response.data.fileContent}`
            setPdfSrc(pdfSrc)
          } else if (fileType === 'htm') {
            // If fileType is HTML, assume it's base64-encoded HTML
            // Decode base64 content with proper handling of non-ASCII characters
            const decodedHTML = decodeURIComponent(escape(atob(response.data.fileContent)))

            setFileContent(decodedHTML) // Set the decoded HTML content
          }
        } else {
          console.log('Empty or invalid content in the response.')
        }
      }
    } catch (error) {
      console.error('Error fetching read Article File:', error)
    }
  }

  const handleEditDetail = () => {
    fetchReadArticleFile('jpg')
    setEditDetailsDialogOpen(true)
  }

  const handleEditDetailsDialogClose = () => {
    setEditDetailsDialogOpen(false)
    setImageSrc('')
  }

  const handleViewHTML = () => {
    fetchReadArticleFile('htm')
    setHtmlDialogOpen(true) // Open the HTML full-screen dialog
  }

  const handleViewJPG = () => {
    fetchReadArticleFile('jpg')
    setJpgDialogOpen(true)
  }

  const handleViewPDF = () => {
    fetchReadArticleFile('pdf')
    setPdfDialogOpen(true)
  }

  const handleJpgDialogClose = () => {
    setJpgDialogOpen(false)
    setImageSrc('')
  }

  const handleHtmlDialogClose = () => {
    setHtmlDialogOpen(false)
    setFileContent('')
  }

  const handlePdfDialogClose = () => {
    setPdfDialogOpen(false)
    setPdfSrc('')
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        View Options
        <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogActions>
        <Button onClick={handleViewHTML} color='primary'>
          View HTML
        </Button>
        <Button onClick={handleViewJPG} color='primary'>
          View JPG
        </Button>
        <Button onClick={handleViewPDF} color='primary'>
          View PDF
        </Button>
        <Button onClick={handleEditDetail} color='primary'>
          Edit Detail
        </Button>

        {/* Render the FullScreenDialog component when open */}
        <FullScreenJPGDialog
          open={jpgDialogOpen}
          handleClose={handleJpgDialogClose}
          imageSrc={imageSrc}
          articles={articles}
        />
        {/* Render the FullScreenHTMLDialog component when open */}
        <FullScreenHTMLDialog
          open={htmlDialogOpen}
          handleClose={handleHtmlDialogClose}
          fileContent={fileContent}
          articles={articles}
        />
        {/* Render the FullScreenPDFDialog component when open */}
        <FullScreenPDFDialog
          open={pdfDialogOpen}
          handleClose={handlePdfDialogClose}
          pdfSrc={pdfSrc}
          articles={articles}
        />
        <FullScreenEditDetailsDialog
          open={editDetailsDialogOpen}
          handleClose={handleEditDetailsDialogClose}
          articles={articles}
          imageSrc={imageSrc}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ViewDialog
