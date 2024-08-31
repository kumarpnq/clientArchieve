import IconifyIcon from 'src/@core/components/icon'

export const getEmojis = sentiment => {
  switch (sentiment) {
    case 'positive':
      return <IconifyIcon icon='ph:smiley-fill' color='#76fa46' />
    case 'neutral':
      return <IconifyIcon icon='ph:smiley-meh-fill' color='#fadf46' />
    case 'negative':
      return <IconifyIcon icon='ph:smiley-sad-fill' color='red' />
    default:
      return <IconifyIcon icon='ph:smiley-meh-fill' color='#fadf46' />
  }
}
