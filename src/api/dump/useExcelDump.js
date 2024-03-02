import axios from 'axios'
import { BASE_URL } from '../base'

const useExcelDump = () => {
  const fetchData = async ({ clientId, selectedFields, searchCriteria }) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      const response = await axios.post(
        `${BASE_URL}/excelDumpRequest`,
        {
          clientId,
          selectedFields,
          searchCriteria
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      )

      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return fetchData
}

export default useExcelDump
