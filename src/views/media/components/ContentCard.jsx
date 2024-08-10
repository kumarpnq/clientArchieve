import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  Tooltip,
  tooltipClasses,
  Typography,
  useMediaQuery
} from '@mui/material'
import XIcon from '@mui/icons-material/X'
import styled from '@emotion/styled'
import ShareIcon from '@mui/icons-material/Share'
import InsertCommentIcon from '@mui/icons-material/InsertComment'
import AnchorIcon from '@mui/icons-material/Anchor'
import InsightsIcon from '@mui/icons-material/Insights'

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })
)

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`
}))

const FlexBox = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
})

const BadgeAvatars = () => {
  return (
    <Stack direction='row' spacing={2}>
      <Badge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={<SmallAvatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />}
      >
        <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
      </Badge>
    </Stack>
  )
}

const ContentCard = () => {
  // Use media query to determine if the screen width is below 1024px
  const isSmallScreen = useMediaQuery('(max-width:1024px)')

  return (
    <Box component={Paper} width={'100%'} height={'auto'} py={2} px={2} my={1}>
      <Box display='flex' flexDirection={isSmallScreen ? 'column' : 'row'} alignItems={'flex-start'} gap={2}>
        {/* First Portion */}
        <Box flex={isSmallScreen ? 'none' : 6} display='flex' alignItems='flex-start' gap={2}>
          <BadgeAvatars />
          <Box>
            <Typography component={'div'} display={'flex'} alignItems={'center'} gap={1}>
              <Link href={'https://www.youtube.com'} target='_blank' rel='noopener'>
                TrakinTech
              </Link>
              <Link href={'https://www.youtube.com'} target='_blank' rel='noopener'>
                @TrakinTech
              </Link>
              <span>shared an image</span>
            </Typography>
            <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
              {/* Image */}
              <Box
                sx={{
                  width: 80,
                  height: 65,
                  border: '1px solid lightgray',
                  borderRadius: '3px',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  fontSize: '0.5em',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
                alt='thumbnail'
              >
                thumbnail
              </Box>
              <Box>
                <Typography variant='subtitle1' fontSize='0.9em' fontWeight={'bold'}>
                  vivo T3 Unboxing & First Impressions ⚡Dimensity 7200, 50MP IMX882 OIS Camera & More @₹17,999*!?
                </Typography>
                <Link
                  href='https://www.youtube.com/watch?v=lHC9QcimJqU'
                  target='_blank'
                  rel='noopener'
                  fontSize={'0.8em'}
                >
                  https://www.youtube.com/watch?v=lHC9QcimJqU
                </Link>
              </Box>
            </Box>
            {/* Date & media link */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Link
                href='https://twitter.com'
                target='_blank'
                rel='noopener'
                fontSize={'0.7em'}
                color={'text.primary'}
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                published on 21/03/24 12:24
              </Link>
              |<span style={{ fontSize: '0.7em' }}>India</span>|
              <Link href='https://twitter.com' target='_blank' rel='noopener' sx={{ mt: 1 }}>
                <XIcon fontSize='0.9em' />
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem sx={{ flexGrow: 0 }} />

        {/* Second Portion */}
        <Box
          flex={isSmallScreen ? 'none' : 4}
          display='flex'
          flexDirection={isSmallScreen ? 'row' : 'column'}
          justifyContent='space-between'
          alignItems={isSmallScreen ? 'center' : 'flex-start'}
          gap={1}
        >
          <Typography
            component={'div'}
            color='text.secondary'
            display='flex'
            alignItems='center'
            justifyContent={'space-between'}
            width={'100%'}
          >
            <span style={{ fontSize: '22px' }}>😐 🙂</span>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Typography>

          <FlexBox>
            <Typography variant='body2' color='text.primary' width={'20%'} fontWeight={'bold'}>
              MATCHES
            </Typography>
            <Typography variant='body2' width={'100%'}>
              Vivo - Sample
            </Typography>
          </FlexBox>
          <FlexBox>
            <Typography variant='body2' color='text.primary' fontWeight={'bold'} width={'20%'}>
              METRICS
            </Typography>
            <Box>
              <FlexBox>
                <Typography display='flex' alignItems='center' gap={0.5}>
                  <CustomTooltip title='Engagement'>
                    <InsertCommentIcon />
                  </CustomTooltip>
                  <span>259</span>
                </Typography>
                <Typography display='flex' alignItems='center' gap={0.5}>
                  <CustomTooltip title='Potential Reach'>
                    <AnchorIcon />
                  </CustomTooltip>
                  <span>533.9K</span>
                </Typography>
                <Typography display='flex' alignItems='center' gap={0.5}>
                  <CustomTooltip title='Trending score'>
                    <InsightsIcon />
                  </CustomTooltip>
                  <span>0/10</span>
                </Typography>
              </FlexBox>
              <Typography variant='body2'>
                <span>28 Retweets, 6 Twitter Replies, 225 Twitter Likes,</span>
                <span>533.9K Twitter Followers, 5.6K Twitter Impressions</span>
              </Typography>
            </Box>
          </FlexBox>
        </Box>
      </Box>
    </Box>
  )
}

export default ContentCard
