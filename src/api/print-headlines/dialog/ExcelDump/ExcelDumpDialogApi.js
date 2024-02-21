import axios from 'axios'

const base_url = process.env.NEXT_PUBLIC_BASE_URL

export const getArticleFieldList = async accessToken => {
  try {
    const response = await axios.get(`${base_url}/articleDownloadFieldList/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data.fields
  } catch (error) {
    console.error('Error fetching field list:', error)
    throw error
  }
}
