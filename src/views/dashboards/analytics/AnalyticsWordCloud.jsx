import WordCloud from 'react-wordcloud'
import CircularProgress from '@mui/material/CircularProgress'
import useClientWiseWordCloud from 'src/api/dashboard-analytics/useClientWiseWordCloud'
import Card from '@mui/material/Card'

const AnalyticsWordCloud = () => {
  const { clientWiseWordCloud, loading } = useClientWiseWordCloud()

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [12, 48]
  }

  const size = [500, 400]

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Card sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <WordCloud
          words={clientWiseWordCloud.map(({ word, size }) => ({ text: word, value: size }))}
          options={options}
          size={size}
        />
      )}
    </Card>
  )
}

export default AnalyticsWordCloud
