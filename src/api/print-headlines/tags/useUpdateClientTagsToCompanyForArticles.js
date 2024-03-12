// useUpdateClientTagsToCompanyForArticles.js
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useUpdateClientTagsToCompanyForArticles = () => {
  const postData = async ({ clientId, companyId, tagsForPost, articleId }) => {
    const storedToken = localStorage.getItem('accessToken')

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`
      }

      const requestData = {
        clientId,
        companyIdsAndTags: [
          {
            companyId: companyId,
            tags: tagsForPost
          }
        ],
        articleId
      }

      await axios.post(`${BASE_URL}/updateTagsForArticle`, requestData, { headers })
    } catch (error) {
      console.log(error.message || error.response?.data || error)
    }
  }

  return postData
}

export default useUpdateClientTagsToCompanyForArticles
