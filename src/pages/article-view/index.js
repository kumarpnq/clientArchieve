import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { Box, Card, CircularProgress, Tabs, Tab } from '@mui/material'
import axios from 'axios'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import PublicationInfo from 'src/views/unprotected/PublicationInfo'
import PublicationLogo from 'src/views/unprotected/PublicationLogo'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const MultiViewNonProtected = ({ articleCodeFromTab }) => {
  const router = useRouter()
  const { articleCode } = router.query
  const [value, setValue] = useState(0)
  const [articleData, setArticleData] = useState({})
  const [articleLoading, setArticleLoading] = useState(false)
  const [articleError, setArticleError] = useState(null)
  const [textContent, setTextContent] = useState('')

  const [cachedContent, setCachedContent] = useState({
    html: null,
    jpg: null,
    pdf: null,
    text: null
  })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const tabValue = type => {
    switch (type) {
      case 'jpg':
        return 1
      case 'htm':
        return 0
      case 'pdf':
        return 2
      case 'txt':
        return 3
      default:
        return 0
    }
  }

  useEffect(() => {
    const fetchArticleViewData = async () => {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
      try {
        setArticleLoading(true)
        const code = articleCodeFromTab ? articleCodeFromTab : articleCode
        const response = await axios.get(`${BASE_URL}/articleView/?articleCode=${code}`)
        setArticleData(response.data)
        setValue(tabValue(response.data.defaultType))
      } catch (error) {
        setArticleError(error)
      } finally {
        setArticleLoading(false)
      }
    }
    if (articleCode || articleCodeFromTab) {
      fetchArticleViewData()
    }
  }, [articleCode, articleCodeFromTab])

  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        const response = await axios.get(articleData.TXTPATH)
        setTextContent(response.data)
        setCachedContent(prev => ({ ...prev, text: response.data }))
      } catch (error) {
        console.error('Error fetching text content:', error)
      }
    }

    if (value === 3 && articleData?.TXTPATH && !cachedContent.text) {
      fetchTextContent()
    }
  }, [value, articleData, cachedContent.text])

  useEffect(() => {
    const cacheData = () => {
      setCachedContent(prev => ({
        ...prev,
        html: prev.html || articleData?.HTMLPATH,
        jpg: prev.jpg || articleData?.JPGPATH,
        pdf: prev.pdf || articleData?.PDFPATH
      }))
    }

    if (articleData) {
      cacheData()
    }
  }, [articleData])

  const renderContent = () => {
    if (articleLoading) {
      return <CircularProgress />
    }

    if (articleError) {
      return <div>Error loading article: {articleError.message}</div>
    }

    if (value === 3) {
      return (
        <Box sx={{ minHeight: '800px', backgroundColor: 'white', color: 'black', p: 2 }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{cachedContent.text || textContent}</pre>
        </Box>
      )
    }

    const src =
      value === 0 ? cachedContent.html : value === 1 ? cachedContent.jpg : value === 2 ? cachedContent.pdf : ''

    return (
      <iframe
        src={src}
        frameBorder='0'
        style={{
          width: '100%',
          minHeight: '800px'
        }}
      />
    )
  }

  return (
    <Fragment>
      <Head>
        <title>{articleData?.headlines}</title>
      </Head>
      <Card sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <PublicationLogo />
      </Card>
      <Card sx={{ mt: 1 }}>
        <PublicationInfo articles={articleData} />
      </Card>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
            <Tab label='HTML' {...a11yProps(0)} />
            <Tab label='JPG' {...a11yProps(1)} />
            <Tab label='PDF' {...a11yProps(2)} />
            <Tab label='TEXT' {...a11yProps(3)} />
          </Tabs>
        </Box>
      </Box>
      <Card
        className='flex items-center justify-center mt-1 border'
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}
      >
        {renderContent()}
      </Card>
    </Fragment>
  )
}

MultiViewNonProtected.getLayout = page => <BlankLayout>{page}</BlankLayout>
MultiViewNonProtected.guestGuard = false

export default MultiViewNonProtected
