import axios from 'axios'
import { BASE_URL } from '../base'

const useFetchReadArticleFile = (setImageSrc, setPdfSrc, setFileContent) => {
  const fetchReadArticleFile = async (fileType, articles) => {
    try {
      const storedToken = localStorage.getItem('accessToken')

      if (storedToken) {
        const request_params = {
          articleId: articles.articleId,
          fileType: fileType
        }

        const response = await axios.get(`${BASE_URL}/readArticleFile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: request_params,
          responseType: 'json' // Set the responseType to 'json'
        })

        // Check if the response contains valid content
        if (response.data && response.data.fileContent) {
          if (fileType === 'jpg') {
            const imageSrc = `data:image/jpeg;base64,${response.data.fileContent}`
            setImageSrc(imageSrc)
          } else if (fileType === 'pdf') {
            const pdfSrc = `data:application/pdf;base64,${response.data.fileContent}`
            setPdfSrc(pdfSrc)
          } else if (fileType === 'htm') {
            // If fileType is HTML, assume it's base64-encoded HTML
            // Decode base64 content with proper handling of non-ASCII characters
            const decodedHTML = decodeURIComponent(escape(atob(response.data.fileContent)))

            setFileContent(decodedHTML) // Set the decoded HTML content
          }
        } else {
          console.log('Empty or invalid content in the response.')
        }
      }
    } catch (error) {
      console.error('Error fetching read Article File:', error)
    }
  }

  return { fetchReadArticleFile }
}

export default useFetchReadArticleFile
