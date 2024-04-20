// src/@core/layouts/components/shared-components/DaysJumper.js
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectShortCut, setSelectedDateRange } from 'src/store/apps/user/userSlice'
import SvgIcon from '@mui/material/SvgIcon'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
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
  console.log('shortCutData==>', shortCutData?.searchCriteria?.fromDate)
  const [selectedDayFilter, setSelectedDayFilter] = useState('1D')

  const calculateDate = days => dayjs().subtract(days, 'day')

  const handleFilter = (days, label) => {
    const start = calculateDate(days)
    dispatch(
      setSelectedDateRange(
        { startDate: start, endDate: start } || {
          startDate: shortCutData?.searchCriteria?.fromDate,
          endDate: shortCutData?.searchCriteria?.toDate
        }
      )
    )
    setSelectedDayFilter(label)
  }

  const handleFilterChange = (days, label) => {
    const startDate = calculateDate(days)
    dispatch(setSelectedDateRange({ startDate, endDate: dayjs() }))
    setSelectedDayFilter(label)
  }

  useEffect(() => {
    handleFilter(1, '1D') // Default filter
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
