import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

//* Mui
import { Box, Card, CircularProgress } from '@mui/material'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// * third party imports
import axios from 'axios'

// * components
import BlankLayout from 'src/@core/layouts/BlankLayout'
import PublicationInfo from 'src/views/unprotected/PublicationInfo'
import PublicationLogo from 'src/views/unprotected/PublicationLogo'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const MultiViewNonProtected = () => {
  const router = useRouter()
  const { articleCode } = router.query
  const [value, setValue] = useState(0)
  const [articleData, setArticleData] = useState({})
  const [articleLoading, setArticleLoading] = useState(false)
  const [articleError, setArticleError] = useState(null)
  const [textContent, setTextContent] = useState('')

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
      default:
        return 0
    }
  }

  useEffect(() => {
    const fetchArticleViewData = async () => {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
      try {
        setArticleLoading(true)
        const response = await axios.get(`${BASE_URL}/articleView/?articleCode=${articleCode}`)
        setArticleData(response.data)
        const type = tabValue(response.data.defaultType)
        setValue(type)
      } catch (error) {
        console.log(error)
        setArticleError(error)
      } finally {
        setArticleLoading(false)
      }
    }
    fetchArticleViewData()
  }, [articleCode])

  useEffect(() => {
    if (value === 3 && articleData?.TXTPATH) {
      axios
        .get(articleData.TXTPATH)
        .then(response => {
          setTextContent(response.data)
        })
        .catch(error => {
          console.error('Error fetching text content:', error)
        })
    }
  }, [value, articleData])

  const renderContent = () => {
    if (articleLoading) {
      return <CircularProgress />
    }
    if (value === 3) {
      return (
        <div
          style={{
            minHeight: '800px',
            backgroundColor: 'white',
            color: 'black',
            padding: '16px'
          }}
        >
          <pre
            style={{
              minHeight: '800px',
              backgroundColor: 'white',
              color: 'black',
              padding: '16px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {textContent}
          </pre>
        </div>
      )
    }

    const src =
      value === 0 ? articleData?.HTMLPATH : value === 1 ? articleData?.JPGPATH : value === 2 ? articleData?.PDFPATH : ''

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
      <Card sx={{ position: 'sticky', top: 0 }}>
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
