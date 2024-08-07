import { Box, Paper, Typography, IconButton, Divider } from '@mui/material'
import Link from 'next/link'
import React, { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const MainView = ({ article }) => {
  const [activeView, setActiveView] = useState({
    web: true,
    text: false
  })

  return (
    <Box component={Paper}>
      <Divider sx={{ py: 1 }} />
      {/* Controls */}
      <Typography component={'div'} display={'flex'} alignItems={'center'} gap={1} pt={1}>
        <IconButton
          aria-label='web-view'
          sx={{
            bgcolor: activeView.web ? 'primary.main' : 'transparent',
            color: activeView.web ? 'text.primary' : 'primary'
          }}
          onClick={() =>
            setActiveView({
              web: true,
              text: false
            })
          }
        >
          <IconifyIcon icon={'lets-icons:view-alt-light'} />
        </IconButton>
        <Link href={article?.socialFeedlink || ''} target='_blank'>
          <IconifyIcon icon={'arcticons:emoji-web'} />
        </Link>
        <IconButton
          aria-label='text-view'
          sx={{
            bgcolor: activeView.text ? 'primary.main' : 'transparent',
            color: activeView.text ? 'text.primary' : 'primary'
          }}
          onClick={() =>
            setActiveView({
              web: false,
              text: true
            })
          }
        >
          <IconifyIcon icon={'ph:text-t-thin'} />
        </IconButton>
      </Typography>
      <Divider sx={{ py: 1 }} />

      {/* actual view */}
      {activeView.text ? (
        <Box width={'100%'} px={4}>
          <Typography component={'span'} fontWeight='thin'>
            something else? Over the weekend, I test drove XUV 700, Kodiaq and GLC. No particular reason for picking
            these, just that the showrooms fell on the same route. XUV 700 Overall, it felt like a solid package for the
            price, but again I did not really explore this segment deeply. I primarily test drove it to experience the
            engine which has rave reviews. Enjoyed the power delivery Sub-par music system. Did not enjoy the
            performance at all. ADAS was a bit nerve wracking for me and I just couldn't trust the car will be able to
            handle it. It would take me some time to get used to it. Had a lag in performance delivery Kodiaq The looks
            of the car in Lava Blue were extremely tempting. It felt much more premium and elegant in comparison to the
            XUV and there seemed to be an open dialogue for discounts because the model would be getting a refresh next
            year. For a ~15 lakh premium over the XUV, it felt justified. The infotainment looked a bit dated 3rd row
            seemed useless Pretty much on par in performance with XUV but did not pull as strongly throughout Also had a
            lag in performance delivery (primarily because of the time it took to downshift) The music system was
            superior in every possible way, loved hearing it. GLC Still is the top choice. Loved the experience overall.
            Also asked about AMG line coming to India but SA mentioned that only GLC Coupe will have it in the near
            future. The performance was superior in every way from the other two. It just kept on pulling no matter the
            speed. The power was also available much quicker, without much lag. Burmester audio did not feel like a
            gamechanger but was still a tad better than Kodiaq's Canton.
          </Typography>
        </Box>
      ) : (
        <iframe src={article?.socialFeedlink} width={'100%'} height={'800px'} frameBorder='0' />
      )}
    </Box>
  )
}

export default MainView
