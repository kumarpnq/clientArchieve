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
        const logoWidth = 50
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth

        page.drawImage(logoImage, {
          x: 10,
          y: height - logoHeight - 10,
          width: logoWidth,
          height: logoHeight
        })

        page.drawImage(logoImage, {
          x: width - logoWidth - 10,
          y: height - logoHeight - 10,
          width: logoWidth,
          height: logoHeight
        })

        const formattedDetails = `${dayjs(articleData?.articleDate).format('ddd, DD MMM YYYY')}; ${
          articleData?.publicationType
        } - ${articleData?.publicationName}; Size : ${articleData?.space}; Circulation: ${
          articleData?.circulation
        }; Page : ${articleData?.pageNumber}`

        const textOptions = {
          size: 7,
          font: helveticaFont,
          color: rgb(0, 0, 139 / 255)
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

PDFView.getLayout = page => <BlankLayout>{page}</BlankLayout>
PDFView.guestGuard = false

export default PDFView
