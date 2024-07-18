import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'

const useAutoLogout = (timeout = 60000) => {
  const router = useRouter()
  const timer = useRef(null)

  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      handleLogout()
    }, timeout)
  }, [timeout])

  const handleLogout = () => {
    // Perform your logout logic here
    // For example, clearing cookies or localStorage, making an API call to invalidate the session, etc.
    // Redirect to login page after logout
    router.push('/login')
  }

  useEffect(() => {
    const handleActivity = () => resetTimer()

    document.addEventListener('keydown', handleActivity)

    resetTimer() // Set initial timer

    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('keydown', handleActivity)
    }
  }, [resetTimer])

  return null
}

export default useAutoLogout
