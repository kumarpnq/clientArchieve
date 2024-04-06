import { useState, useEffect } from 'react'

const useDebounce = (value, delay) => {
  // State and setter for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup the timeout on unmount or value change
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Only re-run effect if value or delay changes

  return debouncedValue
}

export default useDebounce
