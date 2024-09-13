import { BASE_URL } from 'src/api/base'
import axios from 'axios'

export default function pdfDownload(articleId, fileType) {
  const fetchReadArticleFile = async (articleId, fileType) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      if (storedToken) {
        const request_params = {
          articleId: articleId,
          fileType: fileType
        }

        const response = await axios.get(`${BASE_URL}/readArticleFile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params,
          responseType: 'arraybuffer'
        })

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')

        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.setAttribute('download', `article_${articleId}.${fileType}`)

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error fetching read Article File:', error)
    }
  }

  fetchReadArticleFile(articleId, fileType)
}
