// useUpdateClientTagsToCompanyForArticles.js
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useUpdateClientTagsToCompanyForArticles = () => {
  const postData = async ({ clientId, companyId, tagsForPost, articleId }) => {
    console.log(articleId)
    const storedToken = localStorage.getItem('accessToken')
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`
      }

      const data = {
        clientId: clientId,
        companyId: companyId,
        articleId: articleId,
        clientTags: tagsForPost
      }

      await axios.post(`${BASE_URL}/updateClientTagsToCompany`, data, { headers })
    } catch (error) {
      console.log(error)
    }
  }

  return postData
}

export default useUpdateClientTagsToCompanyForArticles
