import axios from 'axios'
import { BASE_URL } from '../base'

const useExcelDump = () => {
  const postData = async ({ clientId, selectedFields, searchCriteria }) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      const res = await axios.post(
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
      console.log(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  return postData
}

export default useExcelDump
