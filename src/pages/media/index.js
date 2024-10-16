import { Fragment, useEffect, useState } from 'react'
import DataCard from 'src/views/media/DataCard'
import Stepper from 'src/views/media/Stepper'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedEndDate,
  selectSelectedStartDate
} from 'src/store/apps/user/userSlice'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import dayjs from 'dayjs'

const MediaAnalysis = () => {
  const isSecure = true

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cardData, setCardData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(40)

  const [value, setValue] = useState('all')
  const selectedClient = useSelector(selectSelectedClient)
  const clientIds = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedCompaniesString = selectedCompetitions.join(', ')

  const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null
  const formattedToDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = {
          clientIds,
          companyIds: selectedCompaniesString,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          mediaType: value
        }

        const authToken = localStorage.getItem('accessToken')

        const response = await axios.get(`${BASE_URL}/socialMediaData`, {
          params,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })

        setCardData(response.data.socialMediaData)
      } catch (err) {
        setError(err)
        setCardData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [value, formattedFromDate, formattedToDate, clientIds, selectedCompaniesString])

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
