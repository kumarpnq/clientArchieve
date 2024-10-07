import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearDateFilter,
  selectShortCut,
  setClearDateFilter,
  setSelectedDateRange
} from 'src/store/apps/user/userSlice'
import SvgIcon from '@mui/material/SvgIcon'
import dayjs from 'dayjs'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'

const GenericIcon = ({ label, component: IconComponent, ...props }) => (
  <SvgIcon {...props} sx={{ background: 'primary' }}>
    <text x='50%' y='50%' fontSize='14px' textAnchor='middle' alignmentBaseline='middle'>
      {label}
    </text>
  </SvgIcon>
)

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
  const clearDateFlag = useSelector(clearDateFilter)
  const router = useRouter()
  const currentRoute = router.pathname

  const isPrintScreen = currentRoute === '/headlines/print'

  const [selectedDayFilter, setSelectedDayFilter] = useState('1D')

  const handleFilterChange = (days, label) => {
    let startDate

    switch (label) {
      case '1M':
        startDate = dayjs().subtract(1, 'month')
        break
      case '3M':
        startDate = dayjs().subtract(3, 'month')
        break
      case '7D':
        startDate = dayjs().subtract(7, 'day')
        break
      case '1D':
      default:
        startDate = dayjs().subtract(isPrintScreen ? 0 : days, 'day')
    }

    const endDate = dayjs()
    dispatch(setSelectedDateRange({ startDate, endDate }))
    setSelectedDayFilter(label)
    dispatch(setClearDateFilter(false))
  }

  useEffect(() => {
    if (clearDateFlag) {
      setSelectedDayFilter('1D')
      handleFilterChange(1, '1D')
    }
  }, [clearDateFlag])

  useEffect(() => {
    if (shortCutData?.searchCriteria?.fromDate && shortCutData?.searchCriteria?.toDate) {
      const fromDate = dayjs(shortCutData?.searchCriteria?.fromDate)
      const toDate = dayjs(shortCutData?.searchCriteria?.toDate)
      const daysDifference = toDate.diff(fromDate, 'day')

      if (daysDifference === 90) {
        setSelectedDayFilter('3M')
      } else if (daysDifference === 30) {
        setSelectedDayFilter('1M')
      } else if (daysDifference === 7) {
        setSelectedDayFilter('7D')
      } else if (daysDifference === 1) {
        setSelectedDayFilter('1D')
      }
    }
  }, [shortCutData])

  useEffect(() => {
    let days
    switch (selectedDayFilter) {
      case '7D':
        days = 7
        break
      case '1M':
        days = 30
        break
      case '3M':
        days = 90
        break
      case '1D':
      default:
        days = 1
    }

    handleFilterChange(days, selectedDayFilter)
  }, [currentRoute])

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
                shortCutData?.searchCriteria?.fromDate ===
                  dayjs()
                    .subtract(isPrintScreen ? 0 : days, 'day')
                    .format('YYYY-MM-DD HH:mm:ss') &&
                shortCutData?.searchCriteria?.toDate === dayjs().format('YYYY-MM-DD HH:mm:ss'))
                ? 'primary.main'
                : '',
            color: selectedDayFilter === label ? 'inherit' : 'primary.main'
          }}
        >
          <IconComponent label={label} component={GenericIcon} />
        </IconButton>
      ))}
    </Fragment>
  )
}

export default DaysJumper
