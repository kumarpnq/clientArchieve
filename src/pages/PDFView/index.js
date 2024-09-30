import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const PDFView = () => {
  const router = useRouter()
  const { articleId } = router.query

  // State variables
  const [articleData, setArticleData] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  useEffect(() => {
    const fetchArticleViewData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/articleView/?articleCode=${articleId}`)
        setArticleData(response.data)
      } catch (error) {
        console.error('Error fetching article data:', error)
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
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create()

        // Add a page to the PDF
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()

        // Embed a font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Define the text details from articleData
        const details = [
          `Publication Type: ${articleData.publicationType}`,
          `Media: ${articleData.media}`,
          `Publication Name: ${articleData.publicationName}`,
          `Language: ${articleData.language}`,
          `Page Number: ${articleData.pageNumber}`,
          `Space: ${articleData.space}`,
          `Circulation: ${articleData.circulation}`,
          `Article Date: ${articleData.articleDate}`
        ]

        // Define text styling
        const textOptions = {
          size: 14,
          font: helveticaFont,
          color: rgb(0, 0, 0)
        }

        // Draw the text details at the top of the page
        let startY = height - 50
        details.forEach(detail => {
          page.drawText(detail, {
            x: 50,
            y: startY,
            ...textOptions
          })
          startY -= 20 // Move down for next line
        })

        // Fetch and embed the image
        const imageUrl = articleData.JPGPATH
        const imageBytes = await axios.get(imageUrl, { responseType: 'arraybuffer' }).then(res => res.data)
        const embeddedImage = await pdfDoc.embedJpg(imageBytes)

        // Scale and position the image
        const imageWidth = width * 0.8 // 80% of page width
        const imageHeight = (embeddedImage.height / embeddedImage.width) * imageWidth
        page.drawImage(embeddedImage, {
          x: (width - imageWidth) / 2,
          y: startY - imageHeight - 30, // Leave some space between text and image
          width: imageWidth,
          height: imageHeight
        })

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const pdfUrl = URL.createObjectURL(blob)
        setPdfUrl(pdfUrl)

        // Clean up object URL on unmount
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
        <p>Loading PDF...</p>
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
