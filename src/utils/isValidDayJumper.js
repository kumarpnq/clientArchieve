import dayjs from 'dayjs'

export function validateDateRange(fromDate, endDate, dayJumper, screenType) {
  const today = dayjs()
  let expectedFromDate
  let expectedEndDate = today

  switch (screenType) {
    case '1D':
      if (dayJumper === '/headlines/print') {
        expectedFromDate = today.startOf('day')
        expectedEndDate = today.endOf('day')
      } else {
        expectedFromDate = today.subtract(1, 'day').startOf('day')
        expectedEndDate = today.endOf('day')
      }
      break
    case '7D':
      expectedFromDate = today.subtract(7, 'day').startOf('day')
      expectedEndDate = today.endOf('day')
      break
    case '1M':
      expectedFromDate = today.subtract(1, 'month').startOf('day')
      expectedEndDate = today.endOf('day')
      break
    case '3M':
      expectedFromDate = today.subtract(3, 'month').startOf('day')
      expectedEndDate = today.endOf('day')
      break
    default:
      console.error('Invalid screenType')

      return false
  }

  const isFromDateValid = dayjs(fromDate).isSame(expectedFromDate, 'day')
  const isEndDateValid = dayjs(endDate).isSame(expectedEndDate, 'day')

  return isFromDateValid && isEndDateValid
}
