import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Box, CircularProgress } from '@mui/material'
import dayjs from 'dayjs'

const logoUrl = 'https://perceptionandquant.com/logo2.png'

const PDFView = () => {
  const router = useRouter()
  const { articleId } = router.query

  const [articleData, setArticleData] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  useEffect(() => {
    const fetchArticleViewData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/articleView/?articleCode=${articleId}`)
        setArticleData(response.data)
      } catch (error) {
        console.error('Error fetching article data:', error.message)
      }
    }

    if (articleId) {
      fetchArticleViewData()
    }
  }, [articleId, BASE_URL])

  useEffect(() => {
    const createPDF = async () => {
      if (!articleData) return

      try {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Format the details string as required
        const formattedDetails = `${dayjs(articleData.articleDate).format('ddd, DD MMM[-YY]')}; ${
          articleData.publicationType
        } - ${articleData.publicationName}; Size : ${articleData.space} sq.cm.; Circulation: ${
          articleData.circulation
        }; Page : ${articleData.pageNumber}`

        // Define text styling
        const textOptions = {
          size: 7,
          font: helveticaFont,
          color: rgb(0, 0, 0)
        }

        // Calculate the text width to center it
        const textWidth = helveticaFont.widthOfTextAtSize(formattedDetails, textOptions.size)
        const x = (width - textWidth) / 2 // Center the text

        // Draw the formatted details centered
        page.drawText(formattedDetails, {
          x,
          y: height - 50, // Position it near the top
          ...textOptions
        })

        // Fetch and embed the image
        const imageUrl = articleData.JPGPATH
        const imageBytes = await axios.get(imageUrl, { responseType: 'arraybuffer' }).then(res => res.data)
        const embeddedImage = await pdfDoc.embedJpg(imageBytes)
        const imageWidth = width * 0.8 // 80% of page width
        const imageHeight = (embeddedImage.height / embeddedImage.width) * imageWidth

        // Draw the image below the text
        page.drawImage(embeddedImage, {
          x: (width - imageWidth) / 2,
          y: height - 50 - imageHeight - 20, // Leave some space below the text
          width: imageWidth,
          height: imageHeight
        })

        // Serialize the PDF
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const pdfUrl = URL.createObjectURL(blob)
        setPdfUrl(pdfUrl)

        return () => URL.revokeObjectURL(pdfUrl)
      } catch (error) {
        console.error('Error generating PDF:', error)
      }
    }

    createPDF()
  }, [articleData])

  return (
    <>
      {pdfUrl ? (
        <iframe src={pdfUrl} title='PDF Viewer' style={{ width: '100%', height: '100vh' }} />
      ) : (
        <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

let isAuthenticated = false
if (typeof window !== 'undefined') {
  isAuthenticated = Boolean(window.localStorage.getItem('userData'))
}

PDFView.getLayout = page => <BlankLayout>{page}</BlankLayout>
PDFView.guestGuard = !isAuthenticated

export default PDFView
