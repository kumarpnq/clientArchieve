import axios from 'axios'
import { BASE_URL } from 'src/api/base'

export const getArticleFieldList = async (accessToken, entityType) => {
  try {
    const requestData = {
      entityType
    }

    const response = await axios.get(`${BASE_URL}/downloadFieldList/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: requestData
    })

    return response.data.fieldList
  } catch (error) {
    console.error('Error fetching field list:', error)
    throw error
  }
}
