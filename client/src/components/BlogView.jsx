import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Link,
  TextField
} from '@mui/material'
import useUserStore from '../stores/userStore'
import { useState } from 'react'

const BlogView = ({ blog, handleLike, handleDelete, handleAddComment }) => {
  const [comment, setComment] = useState('')
  const user = useUserStore((state) => state.user)
  if (!blog) {
    return null
  }
  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', p: 2 }}>
      <CardContent>
        {/* TITLE */}
        <Typography variant="h3" gutterBottom>
          {blog.title}
        </Typography>

        {/* AUTHOR */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
        >
          by {blog.author}
        </Typography>

        {/* URL */}
        <Typography sx={{ mb: 1 }}>
          <Link href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </Link>
        </Typography>

        {/* USER */}
        <Typography sx={{ mb: 2 }}>added by {blog.user?.name}</Typography>

        {/* LIKES */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography>likes {blog.likes}</Typography>

          {user && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          )}

          {/* DELETE */}
          {blog.user?.username === user?.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(blog)}
            >
              remove
            </Button>
          )}
        </Box>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Comments
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (!comment.trim()) return

            handleAddComment(blog.id, comment)
            setComment('')
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'strech',
              gap: 2,
              mt: 1,
              maxWidth: 450
            }}
          >
            <TextField
              size="small"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              label="Add a comment"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ whiteSpace: 'nowrap', px: 5 }}
            >
              add comment
            </Button>
          </Box>
        </form>

        <ul>
          {blog.comments?.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default BlogView
