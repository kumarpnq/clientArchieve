// @fake-db/auth/jwt.js

import axios from 'axios'
import mock from 'src/@fake-db/mock'
import { BASE_URL } from 'src/api/base'

// import defaultAuthConfig from 'src/configs/auth'

mock.onPost('/jwt/login').reply(async request => {
  const { loginName, password } = JSON.parse(request.data)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  try {
    const response = await axios.post(`${BASE_URL}/authenticatePnQ`, {
      loginName,
      password,
      timeZone
    })

    const { accessToken } = response.data

    const res = await axios.get(`${BASE_URL}/getUserDetails`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { email, fullName, clientList, clientArchiveRoles } = res.data

    const user = {
      email,
      fullName,
      clientList,
      clientArchiveRoles,
      role: 'admin'
    }

    return [200, { accessToken, userData: user }]
  } catch (error) {
    return [400, { error: { email: ['Invalid credentials'] } }]
  }
})

// Other mock endpoints...
