// pages/demo-pages/index.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DemoPage = () => {
  const [videoData, setVideoData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mrss-proxy')
        setVideoData(parseXmlResponse(response.data))
      } catch (error) {
        console.error('Error fetching and parsing MRSS feed:', error)
      }
    }

    fetchData()
  }, [])

  const parseXmlResponse = xmlString => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
      const items = xmlDoc.querySelectorAll('item')

      const parsedData = Array.from(items).map(item => {
        const titleElement = item.querySelector('media\\:title, title')
        const thumbnailElement = item.querySelector('media\\:thumbnail, thumbnail')
        const videoUrlElement = item.querySelector('media\\:url, url')

        return {
          title: titleElement ? titleElement.textContent || '' : '',
          thumbnailUrl: thumbnailElement ? thumbnailElement.getAttribute('url') || '' : '',
          videoUrl: videoUrlElement ? videoUrlElement.textContent || '' : ''

          // Add other fields you need
        }
      })

      return parsedData
    } catch (error) {
      console.error('Error parsing XML:', error)

      return []
    }
  }

  return (
    <>
      <h1>Video Feed</h1>
      <div>
        {videoData &&
          videoData.map((video, index) => (
            <div key={index}>
              <h3>{video.title}</h3>
              <video controls width='400'>
                <source src={video.videoUrl} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
              <img src={video.thumbnailUrl} alt={video.title} />
              {/* Add other fields you want to display */}
            </div>
          ))}
      </div>
    </>
  )
}

export default DemoPage
