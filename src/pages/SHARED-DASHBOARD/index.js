import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// import DataCard from 'src/views/media/DataCard'
import Stepper from 'src/views/media/Stepper'
import PNQCard from 'src/views/media/components/PNQCard'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import { CircularProgress } from '@mui/material'
import dynamic from 'next/dynamic'

const DataCard = dynamic(() => import('src/views/media/DataCard'), {
  loading: () => <CircularProgress />
})

const SharedDashboard = () => {
  const router = useRouter()
  const { id } = router.query

  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('all')
  const [error, setError] = useState('')
  const [cardData, setCardData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(40)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = {
          encryptStr: id
        }

        const response = await axios.get(`${BASE_URL}/socialMediaData`, {
          params
        })
        setCardData(response.data.socialMediaData)
      } catch (err) {
        setCardData([])
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, value])

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  // Slice data for the current page
  const paginatedData = cardData.map(company => ({
    ...company,
    feeds: company?.feeds?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }))

  const [isSelectCard, setIsSelectCard] = useState(false)
  const [selectedCards, setSelectedCards] = useState([])

  return (
    <Fragment>
      <PNQCard />
      {/* stepper */}
      <Stepper
        setCardData={setCardData}
        setIsSelectCard={setIsSelectCard}
        isSelectCard={isSelectCard}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        value={value}
        setValue={setValue}
      />
      <DataCard
        isSelectCard={isSelectCard}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        cardData={paginatedData}
        loading={loading}
      />
      <Box display='flex' justifyContent='center' my={2}>
        <Pagination
          count={Math.ceil(cardData[0]?.feeds?.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
        />
      </Box>
    </Fragment>
  )
}

let isAuthenticated = false
if (typeof window !== 'undefined') {
  isAuthenticated = Boolean(window.localStorage.getItem('userData'))
}

SharedDashboard.getLayout = page => <BlankLayout>{page}</BlankLayout>
SharedDashboard.guestGuard = !isAuthenticated

export default SharedDashboard
