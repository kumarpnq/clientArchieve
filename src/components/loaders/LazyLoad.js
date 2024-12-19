import { Box } from '@mui/material'
import { useInView } from 'react-intersection-observer'

const { Suspense, useEffect, useState } = require('react')
const { default: Placeholder } = require('./Placeholder')

const LazyLoad = ({ children }) => {
  const [shouldObserve, setShouldObserve] = useState(false)

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    initialInView: false,
    rootMargin: '400px',

    // Only start observing when shouldObserve is true
    skip: !shouldObserve
  })

  useEffect(() => {
    // Small delay to ensure page has completed initial render
    const timer = setTimeout(() => {
      setShouldObserve(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Box ref={ref} height='100%'>
      <Suspense fallback={<Placeholder />}>{inView && children}</Suspense>
    </Box>
  )
}

export default LazyLoad
