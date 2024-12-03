import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js'

function useCustomTooltip() {
  const chartInstance = useRef(null)
  const tooltipRef = useRef(null)
  const chartId = useRef(`chart-${Math.random().toString(36).substring(2, 9)}`)
  const cursorRef = useRef({ x: 0, y: 0 })

  const getCanvasWithTooltip = () => {
    const tooltipId = `tooltip-${chartId.current}`
    let tooltipEl = document.getElementById(tooltipId)

    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = tooltipId
      tooltipRef.current = tooltipEl
      tooltipEl.style.position = 'fixed'
      tooltipEl.style.pointerEvents = 'none'
      tooltipEl.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
      tooltipEl.style.borderRadius = '5px'
      tooltipEl.style.opacity = 0
      tooltipEl.style.transition = 'opacity .1s ease'
      tooltipEl.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
      tooltipEl.style.width = '250px'
      tooltipEl.style.height = '150px'
      tooltipEl.style.zIndex = '9999'
      document.body.appendChild(tooltipEl)
    }

    const canvasId = `doughnut-${chartId.current}`
    let canvas = document.getElementById(canvasId)

    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.id = canvasId
      tooltipEl.innerHTML = ''
      tooltipEl.appendChild(canvas)
    }

    return { tooltipEl, ctx: canvas.getContext('2d') }
  }

  const positionTooltip = (tooltipEl, cursorX, cursorY) => {
    const tooltipWidth = 250
    const tooltipHeight = 150
    const gap = 20 // Gap between cursor and tooltip

    let left = cursorX + gap // Default position (right of cursor)
    let top = cursorY - tooltipHeight / 2 // Vertically center with cursor

    // Check if tooltip would go off the right edge of the screen
    if (left + tooltipWidth > window.innerWidth) {
      left = cursorX - tooltipWidth - gap // Position to left of cursor
    }

    // Check vertical boundaries
    if (top < 0) {
      top = 0
    } else if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight
    }

    tooltipEl.style.left = `${left}px`
    tooltipEl.style.top = `${top}px`
  }

  function customTooltip(context) {
    const { tooltip } = context
    const dataPoints = tooltip.dataPoints

    const { ctx, tooltipEl } = getCanvasWithTooltip()

    if (context.tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0'

      return
    }

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Position the tooltip
    positionTooltip(tooltipEl, cursorRef.current.x, cursorRef.current.y)

    const labels = []
    const data = []
    const backgroundColor = []
    dataPoints.forEach(point => {
      labels.push(point.dataset.label)
      data.push(point.raw)
      backgroundColor.push(point.dataset.backgroundColor)
    })

    const doughnutData = {
      labels,
      datasets: [
        {
          label: 'Data',
          data,
          backgroundColor
        }
      ]
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: doughnutData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            align: 'center',
            labels: {
              boxWidth: 12,
              padding: 8,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: dataPoints[0]?.label,
            font: {
              size: 12,
              weight: 'bold'
            },
            padding: {
              bottom: 10
            }
          }
        },
        radius: 50,
        cutout: 45
      }
    })

    tooltipEl.style.opacity = 1
  }

  useEffect(() => {
    const handleMouseMove = event => {
      cursorRef.current = { x: event.clientX, y: event.clientY }

      // Update tooltip position if it's visible
      if (tooltipRef.current && tooltipRef.current.style.opacity !== '0') {
        positionTooltip(tooltipRef.current, event.clientX, event.clientY)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (tooltipRef.current) {
        tooltipRef.current.remove()
      }
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return customTooltip
}

export default useCustomTooltip
