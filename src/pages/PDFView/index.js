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
    const fetchAndModifyPDF = async () => {
      if (!articleData) return

      try {
        // Fetch the PDF from the URL in articleData
        const pdfResponse = await axios.get(`${BASE_URL}/${articleData.PDFPATH}`, {
          responseType: 'arraybuffer' // Handle as binary data
        })

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfResponse.data)

        // Get the first page
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()

        // Embed font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Define starting position
        const startX = 50
        let startY = height - 100

        // Define text details from articleData
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

        // Draw text details on the first page
        details.forEach(detail => {
          firstPage.drawText(detail, {
            x: startX,
            y: startY,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

          // Move position down for next line
          startY -= 20
        })

        // Serialize the PDF
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const modifiedPdfUrl = URL.createObjectURL(blob)
        setPdfUrl(modifiedPdfUrl)
      } catch (error) {
        console.error('Error modifying PDF:', error)
      }
    }

    fetchAndModifyPDF()
  }, [articleData])

  return (
    <iframe
      src={pdfUrl || `${BASE_URL}/${articleData?.PDFPATH}`}
      title='PDF Viewer'
      style={{ width: '100%', height: '100vh' }}
    />
  )
}

let isAuthenticated = false
if (typeof window !== 'undefined') {
  isAuthenticated = Boolean(window.localStorage.getItem('userData'))
}

PDFView.getLayout = page => <BlankLayout>{page}</BlankLayout>
PDFView.guestGuard = !isAuthenticated

export default PDFView
