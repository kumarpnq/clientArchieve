import { useState } from 'react'
import { useCallback } from 'react'

const useLoader = () => {
  const [loading, setLoading] = useState(false)

  const start = useCallback(() => setLoading(true), [setLoading])
  const end = useCallback(() => setLoading(false), [setLoading])

  return { loading, start, end }
}

export default useLoader
