import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import axios from 'axios'
import JSZip from 'jszip'
import * as XLSX from 'xlsx'
import CircularProgress from '@mui/material/CircularProgress'

const ImageDialog = ({ open, handleClose, selectedArticles }) => {
  const [imageSrc, setImageSrc] = useState('')
  const [pdfSrc, setPdfSrc] = useState('')
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingJPG, setLoadingJPG] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const fetchReadArticleFile = async (articleId, fileType) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      if (storedToken) {
        const base_url = 'http://51.68.220.77:8001'

        const request_params = {
          articleId: articleId,
          fileType: fileType
        }

        console.log(articleId)

        const response = await axios.get(`${base_url}/readArticleFile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params,
          responseType: 'json'
        })

        if (response.data && response.data.fileContent) {
          return response.data.fileContent // Return file content directly
        } else {
          console.log('Empty or invalid content in the response.')
        }
      }
    } catch (error) {
      console.error('Error fetching read Article File:', error)
    }
  }

  // ... (previous code)

  const handleDownload = async (fileType, setLoading) => {
    setLoading(true)
    try {
      const zip = new JSZip()

      // Add Excel file to zip only if fileType is 'jpg' or 'pdf'
      if (fileType === 'jpg' || fileType === 'pdf') {
        const dataToExport = selectedArticles.map(article => ({
          ArticleId: article.articleId,
          Publication: article.publication,
          ArticleDate: new Date(article.articleDate).toLocaleDateString('en-GB'),
          Companies: article.companies.map(company => company.name).join(', '), // Concatenate company names
          PageNumber: article.pageNumber,
          Language: article.language
        }))

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(dataToExport)
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

        // Convert Excel blob to binary
        const excelData = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' })
        zip.file('articles.xlsx', excelData, { binary: true })
      }

      for (const article of selectedArticles) {
        try {
          const fileContent = await fetchReadArticleFile(article.articleId, fileType)

          if (fileContent) {
            const fileSrc = `data:${fileType === 'jpg' ? 'image/jpeg' : 'application/pdf'};base64,${fileContent}`

            // Add the file to the zip archive
            zip.file(`downloaded_${article.articleId}.${fileType}`, fileContent, { base64: true })
          } else {
            console.log('Empty or invalid content in the response.')
          }
        } catch (error) {
          console.error('Error downloading file:', error)
        }
      }

      // Generate a blob from the zip content and create a download link
      zip.generateAsync({ type: 'blob' }).then(blob => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'downloaded_files.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setLoading(false)
      })
    } catch (error) {
      console.error('Error creating zip file:', error)
      setLoading(false)
    }
  }

  // ... (rest of the code remains unchanged)

  const handleDownloadExcel = () => {
    // Extract only the desired fields from each article
    const dataToExport = selectedArticles.map(article => ({
      ArticleId: article.articleId,
      Publication: article.publication,
      ArticleDate: new Date(article.articleDate).toLocaleDateString('en-GB'),
      Companies: article.companies.map(company => company.name).join(', '), // Concatenate company names
      PageNumber: article.pageNumber,
      Language: article.language
    }))

    // Create a new workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataToExport)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'articles.xlsx')
  }

  const handleDownloadJPG = () => {
    handleDownload('jpg', setLoadingJPG)
  }

  const handleDownloadPDF = () => {
    handleDownload('pdf', setLoadingPDF)
  }

  const isDownloadDisabled = selectedArticles.length === 0

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Download
        <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogActions>
        {/* <Button color='primary' onClick={handleDownloadExcel} disabled={isDownloadDisabled}>
          Download Excel
        </Button> */}
        <Button color='primary' onClick={handleDownloadJPG} disabled={isDownloadDisabled || loadingJPG}>
          {loadingJPG ? <CircularProgress size={24} color='primary' /> : 'Download JPG'}
        </Button>
        <Button color='primary' onClick={handleDownloadPDF} disabled={isDownloadDisabled || loadingJPG}>
          {loadingPDF ? <CircularProgress size={24} color='primary' /> : 'Download PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageDialog
