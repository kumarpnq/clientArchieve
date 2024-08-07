import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Header from './components/Header'
import MainView from './components/MainView'

const ArticleView = ({ open, setOpen, article, setArticle }) => {
  const handleClose = () => {
    setArticle(null)
    setOpen(prev => !prev)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='3xl' fullWidth>
      <DialogTitle color='primary'>Article view</DialogTitle>
      <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 2, top: 2 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Header article={article} />
        <MainView article={article} />
      </DialogContent>
    </Dialog>
  )
}

export default ArticleView
