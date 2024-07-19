import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useAutoLogout = (timeout = 60000) => {
  const router = useRouter()
  const timer = useRef(null)

  const handleLogout = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      try {
        const response = await axios.post(`${BASE_URL}/logout`, null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })

        if (response?.status === 200) {
          window.localStorage.removeItem('userData')
          window.localStorage.removeItem('accessToken')
          window.location.href = '/login'
        } else {
          console.error('Failed to logout:', response.status, response.statusText)
        }
      } catch (error) {
        if (error?.response?.status === 500) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userData')
          window.location.href = '/login'
        }
      }
    }
  }, [router])

  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(handleLogout, timeout)
  }, [timeout, handleLogout])

  useEffect(() => {
    const handleActivity = () => resetTimer()

    document.addEventListener('keydown', handleActivity)
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('mousedown', handleActivity)

    resetTimer()

    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('mousedown', handleActivity)
    }
  }, [resetTimer])

  return null
}

export default useAutoLogout
