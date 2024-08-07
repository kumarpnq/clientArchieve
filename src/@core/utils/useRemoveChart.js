// useRemoveChart.js
import { useDispatch } from 'react-redux'
import { removeChart } from 'src/store/apps/user/userSlice'

const useRemoveChart = () => {
  const dispatch = useDispatch()

  const handleRemoveFromChartList = (DB, chartId) => {
    dispatch(removeChart(DB, chartId))
  }

  return handleRemoveFromChartList
}

export default useRemoveChart
