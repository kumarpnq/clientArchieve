import React, { memo } from 'react'
import Cloud from 'react-wordcloud'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'
import { Stack } from '@mui/material'

const colors = ['#8ab7e1', '#a1bea7', '#1d4388', '#8b8d8c']

const callbacks = {
  getWordColor: () => colors[Math.floor(Math.random() * colors.length)]

  // onWordClick: console.log,
  // onWordMouseOver: console.log,
  // getWordTooltip: word => `${word.text} (${word.value}) [${word.value > 50 ? 'good' : 'bad'}]`
}

const defaultOptions = {
  rotations: 2, // Number of rotation angles
  rotationAngles: [-90, 0, 90], // Angle range
  scale: 'sqrt', // Scaling method
  fontFamily: 'Public Sans, sans-serif',
  enableTooltip: false,
  deterministic: true,
  enableOptimization: true
}

function WordCloud(props) {
  const { metrics, options, id } = props

  return <Cloud id={id} words={metrics} callbacks={callbacks} options={{ ...defaultOptions, ...options }} />
}

export default memo(WordCloud)
