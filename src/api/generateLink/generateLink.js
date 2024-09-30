import axios from 'axios'
import toast from 'react-hot-toast'
import { BASE_URL } from '../base'

export default async function generateLink(articleId) {
  let link = ''
  try {
    const accessToken = localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/getArticleLink/?articleId=${articleId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    link = response.data.link
  } catch (error) {
    toast.error('Error while generating link.')
  }

  return link
}
