// api/mrss-proxy.js
import axios from 'axios'

export default async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.clipbyte.com/mrss?format=raw&Itemid=206&client_id=111edeeab67b7df58e4c1886b86c16d2'
    )
    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error fetching MRSS feed:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
