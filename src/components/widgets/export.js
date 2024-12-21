import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Function to handle JPEG download
export const exportChartAsJPEG = async id => {
  try {
    const chartContainer = document.getElementById(id)

    if (!chartContainer) {
      return
    }

    // Use html2canvas to capture the chart as an image
    const canvas = await html2canvas(chartContainer)

    // Create a download link for the image
    const dataURL = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'chart.jpg'

    // Trigger the download
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.error('Error generating JPEG:', error)
  }
}

export const exportChartAsPDF = async id => {
  try {
    const chartContainer = document.getElementById(id)

    if (!chartContainer) {
      console.error('Chart container not found')

      return
    }

    // Get full chart dimensions
    const chartWidth = chartContainer.offsetWidth
    const chartHeight = chartContainer.offsetHeight

    // Capture the full chart with html2canvas
    const canvas = await html2canvas(chartContainer, {
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: chartWidth,
      height: chartHeight,
      scale: 2, // Increase quality
      windowWidth: chartWidth,
      windowHeight: chartHeight
    })

    // Get canvas dimensions
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // Create PDF with appropriate orientation
    const orientation = canvasWidth > canvasHeight ? 'l' : 'p'
    const pdf = new jsPDF(orientation, 'px', [canvasWidth, canvasHeight])

    // Calculate PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Calculate scaling factors
    const scaleFactorX = pdfWidth / canvasWidth
    const scaleFactorY = pdfHeight / canvasHeight
    const scaleFactor = Math.min(scaleFactorX, scaleFactorY)

    // Calculate centered position
    const xOffset = (pdfWidth - canvasWidth * scaleFactor) / 2
    const yOffset = (pdfHeight - canvasHeight * scaleFactor) / 2

    // Add image to PDF with scaling and centering
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      xOffset, // X position
      yOffset, // Y position
      canvasWidth * scaleFactor, // Width
      canvasHeight * scaleFactor, // Height
      undefined, // Alias
      'FAST' // Compression
    )

    // Save the PDF
    pdf.save('chart.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}
