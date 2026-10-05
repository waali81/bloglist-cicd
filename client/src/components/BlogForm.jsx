import useField from '../hooks/useField'
import { TextField, Button, Box, Typography } from '@mui/material'
import useNotificationStore from '../stores/notificationStore'

const BlogForm = ({ createBlog }) => {
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  )
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      title.inputProps.value.trim() === '' ||
      url.inputProps.value.trim() === ''
    ) {
      showNotification('title and url are required', 'error')
      return
    }

    await createBlog({
      title: title.inputProps.value,
      author: author.inputProps.value,
      url: url.inputProps.value
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create new blog
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="title"
          margin="normal"
          {...title.inputProps}
        />

        <TextField
          fullWidth
          label="author"
          margin="normal"
          {...author.inputProps}
        />

        <TextField fullWidth label="url" margin="normal" {...url.inputProps} />

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm
