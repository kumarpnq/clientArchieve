import dayjs from 'dayjs'

export const formatDateFromM = M => {
  const date = dayjs(M)

  return date.format('YYYY-MM-DD HH:mm:ss')
}
