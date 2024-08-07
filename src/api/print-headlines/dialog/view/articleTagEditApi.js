// src/api/print-headlines/dialog/views/articleTagEditApi.js
import axios from 'axios'

const updateClientTagsToCompany = async (clientId, companyId, clientTags, storedToken) => {
  try {
    const url = 'http://51.68.220.77:8001/updateClientTagsToCompany/'
    const requestData = { clientId, companyId, clientTags }

    const response = await axios.post(url, requestData, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })

    return response.data
  } catch (error) {
    console.error('Error updating client tags:', error)
    throw error
  }
}

export { updateClientTagsToCompany }
