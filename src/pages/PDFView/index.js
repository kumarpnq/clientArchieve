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

  const publicationLogos = [
    '6',
    '8',
    '10',
    '19',
    '21',
    '32',
    '35',
    '36',
    '46',
    '48',
    '51',
    '52',
    '53',
    '54',
    '87',
    '98',
    '99',
    '121',
    '148',
    '164',
    '183',
    '199',
    '209',
    '213',
    '218',
    '232',
    '241',
    '244',
    '258',
    '335',
    '336',
    '337',
    '374',
    '383',
    '410',
    '573',
    '773',
    '775',
    '776',
    '777',
    '822',
    '869',
    '922',
    '996',
    '999',
    '1727',
    '1769',
    'BSPUNE',
    'BSTDHYD',
    'business_standard',
    'ET_H',
    'FINCHRONICLE',
    'FREEPRESS',
    'KASHMIRTIMES',
    'MAILTODAY',
    'METRONOW',
    'MUMBAIMIRROR',
    'thesunguardian',
    'TSG_2018',
    'blank_logo',
    'ASSAM_TRIBUNE',
    'BSCHENNAI',
    'BSHD'
  ]

  useEffect(() => {
    const createPDF = async () => {
      if (!articleData) return

      try {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Embed the first logo (top-left)
        try {
          const logoImageBytes = await axios.get(logoUrl, { responseType: 'arraybuffer' }).then(res => res.data)
          const logoImage = await pdfDoc.embedJpg(logoImageBytes)
          const logoWidth = 50
          const logoHeight = (logoImage.height / logoImage.width) * logoWidth

          // Top-left logo
          page.drawImage(logoImage, {
            x: 10,
            y: height - logoHeight - 10,
            width: logoWidth,
            height: logoHeight
          })

          // Top-right logo
          page.drawImage(logoImage, {
            x: width - logoWidth - 10,
            y: height - logoHeight - 10,
            width: logoWidth,
            height: logoHeight
          })
        } catch (error) {
          console.error('Error embedding top logos:', error)
        }

        // Middle logo with fallback
        let middleLogoHeight = 0 // Define middle logo height
        try {
          const middleLogoUrl = `/publogos/${articleData?.pubGroupId}.jpg`
          let middleLogoBytes
          if (publicationLogos.includes(articleData?.pubGroupId)) {
            middleLogoBytes = await axios.get(middleLogoUrl, { responseType: 'arraybuffer' }).then(res => res.data)
          } else {
            middleLogoBytes = await axios
              .get('/publogos/perception&quant.jpg', { responseType: 'arraybuffer' })
              .then(res => res.data)
          }

          const middleLogoImage = await pdfDoc.embedJpg(middleLogoBytes)

          const middleLogoWidth = 200
          middleLogoHeight = (middleLogoImage.height / middleLogoImage.width) * middleLogoWidth // Capture the height

          const middleLogoX = (width - middleLogoWidth) / 2
          const middleLogoY = height - middleLogoHeight - 5

          page.drawImage(middleLogoImage, {
            x: middleLogoX,
            y: middleLogoY,
            width: middleLogoWidth,
            height: middleLogoHeight
          })
        } catch (error) {
          console.error('Error embedding middle logo or fallback:', error)
        }

        // Text details
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
        const textX = (width - textWidth) / 2
        const textY = height - middleLogoHeight - 15 // Adjust the y position based on the logo height

        page.drawText(formattedDetails, {
          x: textX,
          y: textY,
          ...textOptions
        })

        // Draw article image
        const imageUrl = articleData.JPGPATH
        const imageBytes = await axios.get(imageUrl, { responseType: 'arraybuffer' }).then(res => res.data)
        const embeddedImage = await pdfDoc.embedJpg(imageBytes)
        const imageWidth = width * 0.8
        const imageHeight = (embeddedImage.height / embeddedImage.width) * imageWidth

        page.drawImage(embeddedImage, {
          x: (width - imageWidth) / 2,
          y: textY - imageHeight - 20, // Adjust the position below the text
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
