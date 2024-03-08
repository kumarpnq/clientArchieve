// useUpdateClientTagsToCompanyForArticles.js
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useUpdateClientTagsToCompanyForArticles = () => {
  const postData = async ({ clientId, companyId, tagsForPost, articleId }) => {
    // const companyIdsAndTags = [{ companyId, tags: tagsForPost }]
    // console.log('Company IDs and Tags:', companyIdsAndTags)
    console.log('Article ID:', articleId)

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
      console.error('Error:', error.message || error.response?.data || error)
    }
  }

  return postData
}

export default useUpdateClientTagsToCompanyForArticles
