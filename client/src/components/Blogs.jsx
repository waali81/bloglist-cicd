import { Typography, Card, CardContent } from '@mui/material'
import Blog from './Blog'

const Blogs = ({ blogs }) => {
  return (
    <>
      <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
        Blogs
      </Typography>

      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
        </CardContent>
      </Card>
    </>
  )
}

export default Blogs
