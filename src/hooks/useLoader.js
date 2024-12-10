import { useState } from 'react'
import { useCallback } from 'react'

const useLoader = params => {
  const { initial = false } = params || {}
  const [loading, setLoading] = useState(initial ?? false)

  const start = useCallback(() => setLoading(true), [setLoading])
  const end = useCallback(() => setLoading(false), [setLoading])

  return { loading, start, end }
}

export default useLoader
