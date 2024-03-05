export const formatDateTime = (date, setTime, isEnd) => {
  const isoString = date.toISOString().slice(0, 10)
  const timeString = setTime ? (isEnd ? '23:59:59' : '12:00:00') : date.toISOString().slice(11, 19)

  return `${isoString} ${timeString}`
}
