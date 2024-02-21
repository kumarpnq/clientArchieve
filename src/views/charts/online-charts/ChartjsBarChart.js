// ChartjsBarChart.js
import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Bar } from 'react-chartjs-2'

const ChartjsBarChart = props => {
  const { companyData, primary, labelColor, borderColor, legendColor, warning, info, grey, green, yellow } = props

  // Define an array of additional colors
  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  // Sort companyData based on articleCount in descending order
  // const sortedCompanyData = companyData.slice().sort((a, b) => b.articleCount - a.articleCount)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  // Use the primary and additional colors
  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const data = {
    labels: companyData.map(data => data.company),

    //labels: sortedCompanyData.map(data => data.company),
    datasets: [
      {
        label: 'Article Count',
        backgroundColor: backgroundColors.slice(0, companyData.length),

        // backgroundColor: backgroundColors.slice(0, sortedCompanyData.length),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: companyData.map(data => data.articleCount)

        // data: sortedCompanyData.map(data => data.articleCount)
      }
    ]
  }

  return (
    <Card>
      <CardHeader title='Volume Rank' />
      <CardContent>
        <Bar data={data} height={500} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsBarChart
