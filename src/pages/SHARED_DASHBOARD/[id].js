import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import DataCard from 'src/views/media/DataCard'
import Stepper from 'src/views/media/Stepper'
import PNQCard from 'src/views/media/components/PNQCard'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'

const SharedDashboard = () => {
  const router = useRouter()
  const { id } = router.query
  const idValue = id?.split('id=')[1]

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
          encryptStr: idValue
        }

        const response = await axios.get(`${BASE_URL}/socialMediaData`, {
          params
        })
        setCardData(response.data.socialMediaData)
      } catch (err) {
        console.log(err.message)
        setCardData([])
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [idValue, value])

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  // Calculate data to display for current page
  const paginatedData = cardData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
          count={Math.ceil(cardData.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
        />
      </Box>
    </Fragment>
  )
}

SharedDashboard.getLayout = page => <BlankLayout>{page}</BlankLayout>
SharedDashboard.guestGuard = false

export default SharedDashboard
