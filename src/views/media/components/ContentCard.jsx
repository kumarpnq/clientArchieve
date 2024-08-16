import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  tooltipClasses,
  Typography
} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import XIcon from '@mui/icons-material/X'
import styled from '@emotion/styled'
import ShareIcon from '@mui/icons-material/Share'
import InsertCommentIcon from '@mui/icons-material/InsertComment'
import AnchorIcon from '@mui/icons-material/Anchor'
import InsightsIcon from '@mui/icons-material/Insights'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

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
  border: `2px solid ${theme.palette.background.paper}`,
  background: theme.palette.primary.main
}))

const FlexBox = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
})

const BadgeAvatars = ({ img, mediaType }) => {
  const link =
    mediaType === 'twitter'
      ? 'https://img.icons8.com/?size=100&id=ZNMifeqJbPRv&format=png&color=000000'
      : 'https://img.icons8.com/?size=100&id=15979&format=png&color=000000'

  return (
    <Stack direction='row' spacing={2}>
      <Badge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={<SmallAvatar alt='media' src={link} />}
      >
        <Avatar alt='profile' src={img} />
      </Badge>
    </Stack>
  )
}

const formatDate = dateStr => {
  return dayjs(dateStr).format('DD/MM/YY [at] HH:mm')
}

export const TestCard = ({ item, onCardSelect, isSelectCard }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [expand, setExpand] = useState(false)

  const toggleAccordion = event => {
    setExpand(prev => !prev)
  }

  const handleClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCheckboxChange = event => {
    event.stopPropagation()
    const checked = event.target.checked
    setIsChecked(checked)
    onCardSelect(item, checked)
  }

  // * share posts
  const handleLinkedInPost = link => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer')
  }

  const handleFacebookPost = link => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
    window.open(facebookUrl, '_blank')
  }

  const handleXPost = link => {
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`
    window.open(xUrl, '_blank')
  }

  const handlePinterestPost = link => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(link)}`
    window.open(pinterestUrl, '_blank')
  }

  return (
    <Box component={Paper} sx={{ mt: 1 }}>
      {/* header */}
      <Accordion expanded={expand}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon onClick={toggleAccordion} />}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          {' '}
          {isSelectCard && (
            <Checkbox checked={isChecked} onClick={e => e.stopPropagation()} onChange={handleCheckboxChange} />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1, py: 1 }}>
                <BadgeAvatars img={item.publisherImage} mediaType={item.mediaType} />
                <Link
                  href={item.publisherLink}
                  target='_blank'
                  rel='noopener'
                  fontSize={'0.8em'}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {item.publisherName?.substring(0, 10) + '...'}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h2' fontSize={'0.9em'} fontWeight={'bold'} ml={2}>
                  {item.title?.substring(0, 130) + '...'}
                </Typography>
                {/* second portion */}
                <Typography component={'div'} display={'flex'} alignItems={'center'} width={'100%'} gap={2} ml={2}>
                  <span style={{ color: 'text.secondary', fontSize: '0.8em' }}> {formatDate(item.date)}</span> |{' '}
                  <span style={{ fontSize: '0.8em' }}>{item.publisherLocation}</span> |{' '}
                  <Link href={item.link} sx={{ color: 'primary.main' }} target='_blank' rel='noopener'>
                    {item.mediaType === 'twitter' ? (
                      <XIcon fontSize='small' sx={{ pt: 1 }} />
                    ) : (
                      <YouTubeIcon fontSize='small' sx={{ pt: 1 }} />
                    )}
                  </Link>{' '}
                  |
                  <Typography variant='body2' ml={2}>
                    {/* {item.company_name} */}
                    company
                  </Typography>{' '}
                  |
                  <Typography
                    component={'div'}
                    color='text.secondary'
                    display='flex'
                    alignItems='center'
                    justifyContent={'space-between'}
                  >
                    <span style={{ fontSize: '15px' }}>🙂</span>
                    <IconButton
                      sx={{ color: 'primary.main' }}
                      aria-haspopup='true'
                      onClick={handleClick}
                      aria-controls='customized-menu'
                    >
                      <ShareIcon />
                    </IconButton>
                    <Menu
                      keepMounted
                      elevation={0}
                      anchorEl={anchorEl}
                      id='customized-menu'
                      onClose={handleClose}
                      open={Boolean(anchorEl)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                      }}
                    >
                      <MenuItem onClick={() => handleFacebookPost(item.link)}>
                        <ListItemIcon>
                          <Icon icon='bi:facebook' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on Facebook' />
                      </MenuItem>
                      <MenuItem onClick={() => handleXPost(item.link)}>
                        <ListItemIcon>
                          <Icon icon='arcticons:x-twitter' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on X' />
                      </MenuItem>
                      <MenuItem onClick={() => handleLinkedInPost(item.link)}>
                        <ListItemIcon>
                          <Icon icon='basil:linkedin-outline' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on LinkedIn' />
                      </MenuItem>
                      <MenuItem onClick={() => handlePinterestPost(item.link)}>
                        <ListItemIcon>
                          <Icon icon='ant-design:pinterest-filled' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on Pinterest' />
                      </MenuItem>
                    </Menu>
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* first section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {/* img */}
              <Typography
                sx={{
                  width: 250,
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
                <img alt='thumbnail' src={item.thumbnail} height={65} width={250} />
              </Typography>
            </Box>
            <Divider orientation='vertical' sx={{ color: 'black' }} />
            {/* <hr />   */}

            <Divider orientation='vertical' sx={{ color: 'black' }} />
            {item.mediaType === 'twitter' ? (
              <Box display={'flex'} flexDirection={'column'}>
                <FlexBox>
                  <Typography display='flex' alignItems='center' gap={0.5}>
                    <CustomTooltip title='Engagement'>
                      <InsertCommentIcon />
                    </CustomTooltip>
                    <span>{item.comments}</span>
                  </Typography>
                  <Typography display='flex' alignItems='center' gap={0.5}>
                    <CustomTooltip title='Potential Reach'>
                      <AnchorIcon />
                    </CustomTooltip>
                    <span>{item.anchor}K</span>
                  </Typography>
                  <Typography display='flex' alignItems='center' gap={0.5}>
                    <CustomTooltip title='Trending score'>
                      <InsightsIcon />
                    </CustomTooltip>
                    <span>{item.insights}</span>
                  </Typography>
                </FlexBox>
                <Typography variant='body2'>
                  <span>
                    {item.stats?.retweet_count} Retweets, {item.stats?.reply_count} Twitter Replies,{' '}
                    {item.stats?.likeCount} Twitter Likes,
                  </span>
                  <span>
                    {item.stats?.followersCount}K Twitter Followers, {item.stats?.impression_count} Twitter Impressions
                  </span>
                </Typography>
              </Box>
            ) : (
              <Box display={'flex'} flexDirection={'column'} gap={4}>
                <FlexBox>
                  <Typography display='flex' alignItems='center' gap={0.5}>
                    <CustomTooltip title='Engagement'>
                      <InsertCommentIcon />
                    </CustomTooltip>
                    <span>{item.stats?.commentCount}</span>
                  </Typography>
                  <Typography display='flex' alignItems='center' gap={0.5}>
                    <CustomTooltip title='Potential Reach'>
                      <AnchorIcon />
                    </CustomTooltip>
                    <span>{item.stats?.viewCount}</span>
                  </Typography>
                  <Typography display='flex' alignItems='center' gap={0.5}>
                    <CustomTooltip title='Trending score'>
                      <InsightsIcon />
                    </CustomTooltip>
                    <span>{item.insights}</span>
                  </Typography>
                </FlexBox>
                <Typography variant='body2'>
                  <span>
                    {item.stats?.likeCount} Likes, {item.stats?.viewCount}Views, {item.stats?.commentCount} Count,
                  </span>
                </Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
