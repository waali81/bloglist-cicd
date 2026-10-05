import { Link as RouterLink } from 'react-router-dom'
import { Typography, Divider, Link } from '@mui/material'

const Blog = ({ blog }) => {
  return (
    <>
      <Typography sx={{ py: 1 }}>
        <Link component={RouterLink} to={`/blogs/${blog.id}`} underline="hover">
          {blog.title}
        </Link>
      </Typography>

      <Divider />
    </>
  )
}

export default Blog
