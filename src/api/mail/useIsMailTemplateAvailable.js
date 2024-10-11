import { useState } from 'react'
import axios from 'axios'
import { JOB_SERVER } from '../base'
import useConfigUtils from 'src/utils/configUtils'

const useIsMailTemplate = () => {
  const [isTemplate, setIsTemplate] = useState(null)
  const { storedToken, clientId } = useConfigUtils()

  const checkMailTemplate = async requestEntity => {
    try {
      const params = {
        clientId,
        requestEntity
      }

      const response = await axios.get(`${JOB_SERVER}/checkMailerFormat`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        params
      })

      setIsTemplate(response.data.isTemplate)

      return response.data.status
    } catch (error) {
      setIsTemplate(false)

      return false
    }
  }

  return { isTemplate, checkMailTemplate }
}

export default useIsMailTemplate
