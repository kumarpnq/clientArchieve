import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Box, CircularProgress } from '@mui/material'
import dayjs from 'dayjs'

const logoUrl = '/images/logo.jpg'

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

        // Embed the logo
        const logoImageBytes = await axios.get(logoUrl, { responseType: 'arraybuffer' }).then(res => res.data)
        const logoImage = await pdfDoc.embedJpg(logoImageBytes)
        const logoWidth = 50 // Adjust width as needed
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth

        // Place the logo in the top left corner
        page.drawImage(logoImage, {
          x: 10, // 10 points from the left edge
          y: height - logoHeight - 10, // 10 points from the top edge
          width: logoWidth,
          height: logoHeight
        })

        // Place the logo in the top right corner
        page.drawImage(logoImage, {
          x: width - logoWidth - 10, // 10 points from the right edge
          y: height - logoHeight - 10, // 10 points from the top edge
          width: logoWidth,
          height: logoHeight
        })

        // Format the details string as required
        const formattedDetails = `${dayjs(articleData?.articleDate).format('ddd, DD MMM YYYY')}; ${
          articleData?.publicationType
        } - ${articleData?.publicationName}; Size : ${articleData?.space}; Circulation: ${
          articleData?.circulation
        }; Page : ${articleData?.pageNumber}`

        // Define text styling
        const textOptions = {
          size: 7,
          font: helveticaFont,
          color: rgb(0, 0, 139)
        }

        const textWidth = helveticaFont.widthOfTextAtSize(formattedDetails, textOptions.size)
        const x = (width - textWidth) / 2

        page.drawText(formattedDetails, {
          x,
          y: height - 50,
          ...textOptions
        })

        const imageUrl = articleData.JPGPATH
        const imageBytes = await axios.get(imageUrl, { responseType: 'arraybuffer' }).then(res => res.data)
        const embeddedImage = await pdfDoc.embedJpg(imageBytes)
        const imageWidth = width * 0.8
        const imageHeight = (embeddedImage.height / embeddedImage.width) * imageWidth

        page.drawImage(embeddedImage, {
          x: (width - imageWidth) / 2,
          y: height - 50 - imageHeight - 20,
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
