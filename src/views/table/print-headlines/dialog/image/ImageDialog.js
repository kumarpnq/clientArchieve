import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import axios from 'axios'
import JSZip from 'jszip'
import CircularProgress from '@mui/material/CircularProgress'
import { BASE_URL } from 'src/api/base'
import dayjs from 'dayjs'
import ExcelJS from 'exceljs'

const ImageDialog = ({ open, handleClose, selectedArticles }) => {
  const [loadingJPG, setLoadingJPG] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const fetchReadArticleFile = async (articleId, fileType) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      if (storedToken) {
        const request_params = {
          articleId: articleId,
          fileType: fileType
        }

        const response = await axios.get(`${BASE_URL}/readArticleFile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params,
          responseType: 'arraybuffer'
        })

        return response.data
      }
    } catch (error) {
      console.error('Error fetching read Article File:', error)
    }
  }

  const handleDownload = async (fileType, setLoading) => {
    setLoading(true)
    try {
      const zip = new JSZip()

      if (fileType === 'jpg' || fileType === 'pdf') {
        // Prepare data to export
        const dataToExport = selectedArticles.map(article => ({
          FileName: `${article.articleUploadId?.replace('.pdf', '.jpg')}`,
          Publication: article.publication,
          ArticleDate: dayjs(article.ArticleDate).format('ddd, DD MMM-YY'),
          Companies: article.companies.map(company => company.name).join(', '),
          PageNumber: article.pageNumber,
          Space: article.size
        }))

        // Create a new workbook and a worksheet
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        // Define worksheet columns
        worksheet.columns = [
          { header: 'FileName', key: 'fileName', width: 40 }, // Adjust width to make sure long filenames fit
          { header: 'Publication', key: 'publication', width: 20 },
          { header: 'ArticleDate', key: 'articleDate', width: 15 },
          { header: 'Companies', key: 'companies', width: 25 },
          { header: 'PageNumber', key: 'pageNumber', width: 10 },
          { header: 'Space', key: 'space', width: 10 }
        ]

        // Add data to worksheet and create hyperlinks with styling
        dataToExport.forEach(article => {
          const row = worksheet.addRow({
            fileName: article.FileName,
            publication: article.Publication,
            articleDate: article.ArticleDate,
            companies: article.Companies,
            pageNumber: article.PageNumber,
            space: article.Space
          })

          // Create a hyperlink for the FileName cell
          const fileNameCell = row.getCell('fileName')
          fileNameCell.value = {
            text: article.FileName, // Text shown in the cell
            hyperlink: article.FileName // Actual hyperlink
          }

          // Apply styling (blue color and underline) to the hyperlink
          fileNameCell.font = { color: { argb: 'FF0000FF' }, underline: true } // Blue text with underline
        })

        // Write the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // Add the Excel file to the zip
        zip.file('articles.xlsx', buffer)
      }

      // Add article files (JPG or PDF) to the zip
      for (const article of selectedArticles) {
        try {
          // Fetch the file content based on articleId and fileType (jpg or pdf)
          const fileContent = await fetchReadArticleFile(article.articleId, fileType)

          if (fileContent) {
            // Determine the file type (jpg or pdf) for proper MIME type
            const fileSrc = `data:${fileType === 'jpg' ? 'image/jpeg' : 'application/pdf'};base64,${fileContent}`

            // Use articleUploadId to name the file inside the zip archive
            // For example: articleUploadId might be something like '06CHANDIGARH-20241004-ECONOMIC_TIMES-0011-0006'
            zip.file(`${article.articleUploadId.replace('.pdf', '')}.${fileType}`, fileContent, { base64: true })
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
      console.error('Error creating zip file:', error.message)
      setLoading(false)
    }
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
      <DialogTitle color='primary'>
        Download
        <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogActions>
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
