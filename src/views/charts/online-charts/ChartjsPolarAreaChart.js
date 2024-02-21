// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { PolarArea } from 'react-chartjs-2'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

const ChartjsPolarAreaChart = props => {
  // ** Props
  const { shareOfVoiceData, primary, yellow, warning, info, grey, green, legendColor } = props

  // Define an array of colors
  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: tooltipItem => {
            const value = tooltipItem.formattedValue || tooltipItem.value
            const intValue = Math.round(value)

            return `${tooltipItem.label}: ${intValue}%`
          }
        }
      }
    }
  }

  // Use the primary and additional colors
  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const data = {
    labels: shareOfVoiceData.map(entry => entry.company),
    datasets: [
      {
        borderWidth: 0,
        label: 'Share of Voice',
        data: shareOfVoiceData.map((entry, index) => entry.shareOfVoice),
        backgroundColor: backgroundColors.slice(0, shareOfVoiceData.length)
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Share of Voice'
        action={
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            options={['Refresh', 'Edit', 'Share']}
            iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.secondary' } }}
          />
        }
      />
      <CardContent>
        <PolarArea data={data} height={350} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsPolarAreaChart
