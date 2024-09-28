import { useState, useEffect } from 'react'

const useResponsiveHeadline = () => {
  const [listWidth, setListWidth] = useState(window.innerWidth)

  const getMobileViewHeadlineWidth = value => {
    switch (true) {
      case value < 571:
        return '15rem'
      case value >= 571 && value < 818:
        return '27rem' // Adjusted based on your earlier comment
      case value >= 818 && value < 991:
        return '35rem'
      case value >= 991:
        return '42rem'
      default:
        return 'inherit'
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setListWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    // Call the resize handler initially to set the correct width
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { listWidth, getMobileViewHeadlineWidth }
}

export default useResponsiveHeadline
