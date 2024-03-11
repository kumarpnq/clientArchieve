import axios from 'axios'
import { BASE_URL } from '../base'

const useExcelDump = () => {
  const postData = async ({ clientId, articleIds, selectedFields, searchCriteria }) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      const response = await axios.post(
        `${BASE_URL}/excelDumpRequest`,
        {
          clientId,
          articleIds: articleIds.length > 0 ? articleIds : [],
          selectedFields,
          searchCriteria
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      )
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  return postData
}

export default useExcelDump
