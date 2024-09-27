export const formatDateTime = (date, setTime, isEnd) => {
  if (!date || !(date instanceof Date)) {
    return '' // Return an empty string or handle the error as needed
  }

  const isoString = date.toISOString().slice(0, 10) // Extract YYYY-MM-DD
  const timeString = setTime ? (isEnd ? '23:59:59' : '12:00:00') : date.toISOString().slice(11, 19) // Extract or set time

  return `${isoString} ${timeString}` // Return combined date and time
}
