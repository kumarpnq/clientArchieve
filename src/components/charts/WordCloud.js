import React, { memo } from 'react'
import Cloud from 'react-d3-cloud'

const colors = ['#8ab7e1', '#a1bea7', '#1d4388', '#8b8d8c']
const rotate = () => (Math.random() > 0.5 ? 90 : 0)
const fillColor = () => colors[Math.floor(Math.random() * colors.length)]
function WordCloud(props) {
  const { data, width = 1300, height = 500 } = props

  return (
    <Cloud
      data={data}
      width={width}
      height={height}
      font={'"Poppins",sans-serif'}
      fontSize={word => Math.log2(word.value) * 20}
      spiral='archimedean'
      padding={1}
      rotate={rotate}
      fill={fillColor}

      // onWordClick={(event, d) => {
      //     console.log(`onWordClick: ${d.text}`);
      // }}
      // onWordMouseOver={(event, d) => {
      //     console.log(`onWordMouseOver: ${d.text}`);
      // }}
      // onWordMouseOut={(event, d) => {
      //     console.log(`onWordMouseOut: ${d.text}`);
      // }}
    />
  )
}

export default memo(WordCloud)
