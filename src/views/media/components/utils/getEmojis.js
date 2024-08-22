import IconifyIcon from 'src/@core/components/icon'

export const getEmojis = sentiment => {
  switch (sentiment) {
    case 'positive':
      return <IconifyIcon icon='ph:smiley-fill' color='lightgreen' />
    case 'neutral':
      return <IconifyIcon icon='ph:smiley-meh-fill' color='yellow' />
    case 'negative':
      return <IconifyIcon icon='ph:smiley-sad-fill' color='red' />
    default:
      return <IconifyIcon icon='ph:smiley-meh-fill' color='yellow' />
  }
}
