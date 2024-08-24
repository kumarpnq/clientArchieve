import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectShortCut, setSelectedDateRange } from 'src/store/apps/user/userSlice'
import SvgIcon from '@mui/material/SvgIcon'
import dayjs from 'dayjs'
import IconButton from '@mui/material/IconButton'

// Generic Icon component
const GenericIcon = ({ label, component: IconComponent, ...props }) => (
  <SvgIcon {...props} sx={{ background: 'primary' }}>
    <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
      {label}
    </text>
  </SvgIcon>
)

// Define icons array
const icons = [
  { label: '1D', days: 1, component: GenericIcon },
  { label: '7D', days: 7, component: GenericIcon },
  { label: '1M', days: 30, component: GenericIcon },
  { label: '3M', days: 90, component: GenericIcon }
]

const DaysJumper = ({ settings }) => {
  const { direction } = settings
  const dispatch = useDispatch()
  const shortCutData = useSelector(selectShortCut)

  const [selectedDayFilter, setSelectedDayFilter] = useState('1D')

  const calculateDate = (days, startDate = null) =>
    startDate ? dayjs(startDate).subtract(days, 'day') : dayjs().subtract(days, 'day')

  const handleFilter = (days, label) => {
    const start = calculateDate(days, shortCutData?.searchCriteria?.fromDate)

    dispatch(
      setSelectedDateRange({
        startDate: start || shortCutData?.searchCriteria?.fromDate,
        endDate: start || shortCutData?.searchCriteria?.toDate
      })
    )
    setSelectedDayFilter(label)
  }

  const handleFilterChange = (days, label) => {
    let startDate = calculateDate(days)

    if (label === '1D' || label === '7D') {
      startDate = startDate.add(1, 'day')
    }

    const endDate = dayjs()

    dispatch(setSelectedDateRange({ startDate, endDate }))
    setSelectedDayFilter(label)
  }

  useEffect(() => {
    if (shortCutData?.searchCriteria?.fromDate && shortCutData?.searchCriteria?.toDate) {
      const fromDate = dayjs(shortCutData?.searchCriteria?.fromDate)
      const toDate = dayjs(shortCutData?.searchCriteria?.toDate)
      const daysDifference = toDate.diff(fromDate, 'day')

      if (daysDifference - 1 === 90) {
        handleFilter(daysDifference - 1, '3M')
      } else if (daysDifference - 1 === 30) {
        handleFilter(daysDifference - 1, '1M')
      } else if (daysDifference - 1 === 7) {
        handleFilter(daysDifference - 1, '7D')
      } else if (daysDifference - 1 === 1) {
        handleFilter(daysDifference - 1, '1D')
      }
    }
  }, [shortCutData])

  useEffect(() => {
    handleFilterChange(1, '1D')
  }, [])

  return (
    <Fragment>
      {icons.map(({ label, days, component: IconComponent }) => (
        <IconButton
          key={label}
          onClick={() => handleFilterChange(days, label)}
          sx={{
            backgroundColor:
              selectedDayFilter === label ||
              (label === '1D' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss')) ||
              (label === '7D' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss')) ||
              (label === '1M' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss')) ||
              (label === '3M' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss'))
                ? 'primary.main'
                : '',
            color:
              selectedDayFilter === label ||
              (label === '1D' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss')) ||
              (label === '7D' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss')) ||
              (label === '1M' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss')) ||
              (label === '3M' &&
                shortCutData?.searchCriteria?.fromDate === dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss'))
                ? 'inherit'
                : 'primary.main'
          }}
        >
          <IconComponent label={label} component={GenericIcon} />
        </IconButton>
      ))}
    </Fragment>
  )
}

export default DaysJumper
