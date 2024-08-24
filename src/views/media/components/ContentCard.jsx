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
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import styled from '@emotion/styled'
import ShareIcon from '@mui/icons-material/Share'
import InsertCommentIcon from '@mui/icons-material/InsertComment'
import AnchorIcon from '@mui/icons-material/Anchor'
import InsightsIcon from '@mui/icons-material/Insights'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { useState } from 'react'
import Popper from '@mui/material/Popper'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import DirectMailDialog from './DirectMailDialog'
import IconifyIcon from 'src/@core/components/icon'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import { useSelector } from 'react-redux'
import { selectSelectedClient, selectSelectedCompetitions } from 'src/store/apps/user/userSlice'
import { getEmojis } from './utils/getEmojis'

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

const links = [
  { id: 1, mediaType: 'twitter', link: 'https://img.icons8.com/?size=100&id=ZNMifeqJbPRv&format=png&color=000000' },
  { id: 2, mediaType: 'youtube', link: 'https://img.icons8.com/?size=100&id=15979&format=png&color=000000' },
  { id: 3, mediaType: 'facebook', link: 'https://img.icons8.com/?size=100&id=118468&format=png&color=000000' }
]

const getLinkByMediaType = mediaType => {
  const linkObject = links.find(link => link.mediaType === mediaType)

  return linkObject ? linkObject.link : ''
}

const BadgeAvatars = ({ img, mediaType }) => {
  const link = getLinkByMediaType(mediaType)

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

// * get social media icons according to media type
const getIconByMediaType = mediaType => {
  switch (mediaType) {
    case 'twitter':
      return {
        icon: <XIcon fontSize='small' sx={{ pt: 1 }} />,
        link: 'https://twitter.com'
      }
    case 'youtube':
      return {
        icon: <YouTubeIcon fontSize='small' sx={{ pt: 1 }} />,
        link: 'https://www.youtube.com'
      }
    case 'facebook':
      return {
        icon: <FacebookIcon fontSize='small' sx={{ pt: 1 }} />,
        link: 'https://www.facebook.com'
      }
    default:
      return {
        icon: null,
        link: ''
      }
  }
}

export const TestCard = ({ item, onCardSelect, isSelectCard, selectedCards }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [expand, setExpand] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState()
  const [directSendMailOpen, setDirectSendMailOpen] = useState(false)
  const [linkForDirectMail, setLinkForDirectMail] = useState(null)
  const [updateEmojiLoading, setUpdateEmojiLoading] = useState(false)

  // * redux
  const selectedClient = useSelector(selectSelectedClient)
  const clientIds = selectedClient ? selectedClient.clientId : null
  const selectedCompetitions = useSelector(selectSelectedCompetitions)

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

  const handleEmailPost = item => {
    setLinkForDirectMail(item)
    setDirectSendMailOpen(prev => !prev)
  }

  const getArticleActivities = (mediaType, item) => {
    switch (mediaType) {
      case 'youtube':
        return `Views : ${item.stats.viewCount} | Likes : ${item.stats.likeCount} | Comments : ${item.stats.commentCount} | Favorite : ${item.stats.favoriteCount}`
      case 'twitter':
        return `Followers : ${item.stats.followersCount} | Likes : ${item.stats.likeCount} | Retweets : ${item.stats.retweet_count} | Replies : ${item.stats.reply_count} | Impressions : ${item.stats.impression_count}`
      case 'facebook':
        return `Reactions : ${item.stats.reactionCount}`
      default:
        return ''
    }
  }

  const handleWhatsappPost = item => {
    const activities = getArticleActivities(item.mediaType, item)

    const message = `${item.title}\n ${item.publisherName + ' ' + item.publisherLocation}\n ${activities}\n ${
      item.link
    }`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleInstagramDM = link => {
    const instagramDMUrl = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(link)}`
    window.open(instagramDMUrl, '_blank', 'noopener,noreferrer')
  }

  // Check if the current item is selected
  const isChecked = selectedCards.some(card => card._id === item._id)

  // *
  const [anchorE2, setAnchorE2] = useState(null)

  const handleClickPopper = event => {
    setAnchorE2(anchorE2 ? null : event.currentTarget)
  }

  const open = Boolean(anchorE2)
  const id = open ? 'simple-popper' : undefined

  const emojis = [
    { emoji: <IconifyIcon icon='ph:smiley-fill' color='lightgreen' />, label: 'positive' },
    { emoji: <IconifyIcon icon='ph:smiley-meh-fill' color='yellow' />, label: 'Neutral' },
    { emoji: <IconifyIcon icon='ph:smiley-sad-fill' color='red' />, label: 'negative' }
  ]

  const handleEmojiClick = async (label, item) => {
    console.log(item)

    setUpdateEmojiLoading(true)

    const data = {
      clientId: clientIds,
      companyId: selectedCompetitions.join(','),
      mediaType: item.mediaType,
      feedId: item._id,
      sentiment: label
    }

    const userToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${BASE_URL}/socialMediaSentiment/`, data, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      console.log(response.data.message)

      const selected = emojis.find(item => item.label === label)
      if (selected) {
        setSelectedEmoji(selected.emoji)
        setAnchorE2(null)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setUpdateEmojiLoading(false)
    }
  }

  const { icon, link } = getIconByMediaType(item.mediaType)

  // * formats
  const formatViewCount = count => {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`
    } else if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}k`
    } else {
      return `${count}`
    }
  }

  const viewCount = item.stats?.viewCount || 0
  const likeCount = item.stats?.likeCount || item.stats?.reactionCount || 0
  const commentCount = item.stats?.commentCount || 0

  // Determine which parts to show based on available data
  const showViewCount = viewCount > 0
  const showLikeCount = likeCount > 0
  const showCommentCount = commentCount > 0

  // Create the segments based on available data
  const segments = []
  if (showLikeCount) {
    segments.push(`${formatViewCount(likeCount)} ${item.mediaType === 'facebook' ? 'Reactions' : 'Likes'}`)
  }
  if (showViewCount) {
    segments.push(`${formatViewCount(viewCount)} Views`)
  }
  if (showCommentCount) {
    segments.push(`${formatViewCount(commentCount)} Comments`)
  }

  // Join the segments with commas
  const displayText = segments.join(', ')

  return (
    <Box component={Paper} sx={{ mt: 1 }}>
      {/* header */}
      <Accordion expanded={expand}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon onClick={toggleAccordion} />}
          aria-controls='panel1-content'
          id='panel1-header'
          sx={{ height: 110 }}
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
                <Link href={item?.link || ''} target='_blank' rel='noopener'>
                  <Typography variant='h2' fontSize={'0.9em'} fontWeight={'bold'} ml={2}>
                    {item.title?.substring(0, 100) + '...' || ' '} -
                    {item?.taggedCompanies?.map(i => (
                      <Typography
                        component={'span'}
                        sx={{ color: 'text.secondary', fontSize: '0.8em', ml: 2 }}
                        key={i.companyId}
                      >
                        {i.companyName}
                      </Typography>
                    ))}
                  </Typography>
                </Link>
                {/* second portion */}
                <Typography component={'div'} display={'flex'} alignItems={'center'} width={'100%'} gap={2} ml={2}>
                  <span style={{ color: 'text.secondary', fontSize: '0.8em' }}> {formatDate(item.date)}</span> |{' '}
                  {item.publisherLocation && <span style={{ fontSize: '0.8em' }}>{item.publisherLocation || '|'}</span>}
                  <Link href={link} sx={{ color: 'primary.main' }} target='_blank' rel='noopener'>
                    {icon}
                  </Link>{' '}
                  |
                  <>
                    {(showViewCount || showLikeCount || showCommentCount) && (
                      <span style={{ fontSize: '0.8em' }}>
                        {showViewCount && `${formatViewCount(viewCount)} Views`}
                        {showViewCount && (showLikeCount || showCommentCount) && ', '}
                        {showLikeCount &&
                          `${formatViewCount(likeCount)} ${item.mediaType === 'youtube' ? 'Likes' : 'Reactions'}`}
                        {showLikeCount && showCommentCount && ', '}
                        {showCommentCount && `${formatViewCount(commentCount)} comments`}
                      </span>
                    )}
                  </>
                  <Typography component={'div'} display='flex' alignItems='center' justifyContent={'space-between'}>
                    <IconButton aria-describedby={id} type='button' onClick={handleClickPopper}>
                      <span style={{ fontSize: '25px', fontWeight: 'bolder' }}>
                        {selectedEmoji ? selectedEmoji : getEmojis(item.sentiment)}
                      </span>
                    </IconButton>
                    <Popper id={id} open={open} anchorEl={anchorE2} placement='right'>
                      <Paper elevation={3}>
                        <Box
                          sx={{
                            p: 2,
                            display: 'flex',
                            gap: 1,
                            borderRadius: '2px',
                            backdropFilter: 'blur(5px)'
                          }}
                        >
                          {emojis.map((emoItem, index) => (
                            <Typography
                              key={index}
                              variant='button'
                              display='block'
                              sx={{ cursor: 'pointer', border: 'none', borderRadius: '2px', background: 'none' }}
                              fontSize={'1.5em'}
                              component={'button'}
                              onClick={() => handleEmojiClick(emoItem.label, item)}
                            >
                              {emoItem.emoji}
                            </Typography>
                          ))}
                        </Box>
                      </Paper>
                    </Popper>
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
                      <MenuItem onClick={() => handleWhatsappPost(item)}>
                        <ListItemIcon>
                          <Icon icon='ic:round-whatsapp' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on Whatsapp' />
                      </MenuItem>
                      <MenuItem onClick={() => handleXPost(item.link)}>
                        <ListItemIcon>
                          <Icon icon='arcticons:x-twitter' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on X' />
                      </MenuItem>
                      <MenuItem onClick={() => handleInstagramDM(item.link)}>
                        <ListItemIcon>
                          <Icon icon='hugeicons:instagram' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on Instagram' />
                      </MenuItem>
                      <MenuItem onClick={() => handleFacebookPost(item.link)}>
                        <ListItemIcon>
                          <Icon icon='bi:facebook' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on Facebook' />
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
                      <MenuItem onClick={() => handleEmailPost(item)}>
                        <ListItemIcon>
                          <Icon icon='material-symbols:mail-outline' fontSize={20} />
                        </ListItemIcon>
                        <ListItemText primary='Share on Email' />
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
            {item.thumbnail && (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                {/* img */}
                <Typography
                  sx={{
                    width: 100,
                    height: 100,
                    padding: 2,
                    border: '1px solid lightgray',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    fontSize: '0.75em',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <img
                    alt='thumbnail'
                    src={item.thumbnail}
                    style={{
                      borderRadius: '4px',
                      width: 'auto',
                      height: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Typography>
              </Box>
            )}

            <Divider orientation='vertical' sx={{ color: 'black' }} />
            {/* <hr />   */}

            <Divider orientation='vertical' sx={{ color: 'black' }} />
            {item.mediaType === 'twitter' ? (
              <Box display={'flex'} flexDirection={'column'}>
                <FlexBox>
                  {item.comments && item.comments !== 0 && (
                    <Typography display='flex' alignItems='center' gap={0.5}>
                      <CustomTooltip title='Engagement'>
                        <InsertCommentIcon />
                      </CustomTooltip>
                      <span>{formatViewCount(item.comments)}</span>
                    </Typography>
                  )}
                  {item.anchor && item.anchor !== 0 && (
                    <Typography display='flex' alignItems='center' gap={0.5}>
                      <CustomTooltip title='Potential Reach'>
                        <AnchorIcon />
                      </CustomTooltip>
                      <span>{formatViewCount(item.anchor)}K</span>
                    </Typography>
                  )}
                  {item.insights && item.insights !== 0 && (
                    <Typography display='flex' alignItems='center' gap={0.5}>
                      <CustomTooltip title='Trending score'>
                        <InsightsIcon />
                      </CustomTooltip>
                      <span>{formatViewCount(item.insights)}</span>
                    </Typography>
                  )}
                </FlexBox>
                <Typography variant='body2'>
                  {item.stats?.retweet_count && item.stats.retweet_count !== 0 && (
                    <span>{formatViewCount(item.stats.retweet_count)} Retweets, </span>
                  )}
                  {item.stats?.reply_count && item.stats.reply_count !== 0 && (
                    <span>{formatViewCount(item.stats.reply_count)} Replies, </span>
                  )}
                  {item.stats?.likeCount && item.stats.likeCount !== 0 && (
                    <span>{formatViewCount(item.stats.likeCount)} Likes, </span>
                  )}
                  {item.stats?.followersCount && item.stats.followersCount !== 0 && (
                    <span>{formatViewCount(item.stats.followersCount)} Followers, </span>
                  )}
                  {item.stats?.followingCount && item.stats.followingCount !== 0 && (
                    <span>{formatViewCount(item.stats.followingCount)} Following, </span>
                  )}
                  {item.stats?.impression_count && item.stats.impression_count !== 0 && (
                    <span>{formatViewCount(item.stats.impression_count)} Impressions</span>
                  )}

                  {item.stats?.listedCount && item.stats.listedCount !== 0 && (
                    <span>{formatViewCount(item.stats.listedCount)} Listed</span>
                  )}
                  {item.stats?.bookmark_count && item.stats.bookmark_count !== 0 && (
                    <span>{formatViewCount(item.stats.bookmark_count)} Bookmarks</span>
                  )}
                  {item.stats?.quote_count && item.stats.quote_count !== 0 && (
                    <span>{formatViewCount(item.stats.quote_count)} Quotes</span>
                  )}
                </Typography>
              </Box>
            ) : (
              <Box display={'flex'} flexDirection={'column'} gap={4}>
                <FlexBox sx={{ gap: 4 }}>
                  {item.stats?.commentCount && item.stats.commentCount !== 0 && (
                    <Typography display='flex' alignItems='center' gap={0.5}>
                      <CustomTooltip title='Engagement'>
                        <InsertCommentIcon />
                      </CustomTooltip>
                      <span>{formatViewCount(item.stats.commentCount)}</span>
                    </Typography>
                  )}
                  {item.stats?.viewCount && item.stats.viewCount !== 0 && (
                    <Typography display='flex' alignItems='center' gap={0.5}>
                      <CustomTooltip title='Potential Reach'>
                        <AnchorIcon />
                      </CustomTooltip>
                      <span>{formatViewCount(item.stats.viewCount)}</span>
                    </Typography>
                  )}
                  {item.insights && item.insights !== 0 && (
                    <Typography display='flex' alignItems='center' gap={0.5}>
                      <CustomTooltip title='Trending score'>
                        <InsightsIcon />
                      </CustomTooltip>
                      <span>{formatViewCount(item.insights)}</span>
                    </Typography>
                  )}
                </FlexBox>
                {displayText && (
                  <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {displayText}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* direct send mail */}
      <DirectMailDialog
        open={directSendMailOpen}
        setOpen={setDirectSendMailOpen}
        link={linkForDirectMail}
        setLink={setLinkForDirectMail}
      />
    </Box>
  )
}
