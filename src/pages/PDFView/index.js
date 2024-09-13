import React from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const PDFView = () => {
  return <>PDF View page</>
}
PDFView.getLayout = page => <BlankLayout>{page}</BlankLayout>
PDFView.guestGuard = false

export default PDFView
