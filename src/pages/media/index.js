import { Fragment, useEffect, useState } from 'react'
import useFetchSocialMediaData from 'src/api/SHARED_DASHBOARD/fetchSocialMediaData'
import DataCard from 'src/views/media/DataCard'
import Stepper from 'src/views/media/Stepper'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'

const MediaAnalysis = () => {
  const isSecure = true
  const storedToken = localStorage.getItem('accessToken')

  const [value, setValue] = useState('all')

  const { data, loading, error } = useFetchSocialMediaData({
    mediaType: value,
    encryptStr: '',
    authToken: storedToken
  })

  const [cardData, setCardData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(40)

  useEffect(() => {
    if (error) {
      setCardData([])
    }
    if (data?.length) {
      setCardData(data)
    } else {
      setCardData([])
    }
  }, [data, error])

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
      {/* Stepper */}
      <Stepper
        cardData={cardData}
        setCardData={setCardData}
        setIsSelectCard={setIsSelectCard}
        isSelectCard={isSelectCard}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        isSecure={isSecure}
        value={value}
        setValue={setValue}
      />

      {/* DataCard with paginated feeds */}
      <DataCard
        isSelectCard={isSelectCard}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        cardData={paginatedData}
        setCardData={setCardData}
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

export default MediaAnalysis
