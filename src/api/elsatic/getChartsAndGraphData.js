import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate,
  selectSelectedMedia
} from 'src/store/apps/user/userSlice'

const useGetElasticChartData = props => {
  const { type } = props
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectedClient = useSelector(selectSelectedClient)
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedStartDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const selectedMedia = useSelector(selectSelectedMedia)

  useEffect(() => {
    const fetchElasticChartData = async () => {
      try {
        const response = await axios.post('getChartAndGraphData', {
          // client: selectedClient ,
          // competitions: selectedCompetitions,
          type,
          indicis,
          range: 20,
          startDate: selectedStartDate,
          endDate: selectedEndDate

          // extra:''
        })
        setChartData(response.data)
      } catch (error) {
        setError(error)
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchElasticChartData()
  }, [])

  return { chartData, loading, error }
}

export default useGetElasticChartData
