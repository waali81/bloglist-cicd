import { Link as RouterLink } from 'react-router-dom'
import { Typography, Card, CardContent, Divider, Link } from '@mui/material'

const UserView = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <>
      <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
        {user.name}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Added blogs
      </Typography>

      <Card sx={{ maxWidth: 500 }}>
        <CardContent sx={{ p: 0 }}>
          {user.blogs.map((blog, index) => (
            <div key={blog.id}>
              <Typography sx={{ py: 1.5, px: 2 }}>
                <Link
                  component={RouterLink}
                  to={`/blogs/${blog.id}`}
                  underline="hover"
                >
                  {blog.title}
                </Link>
              </Typography>

              {index < user.blogs.length - 1 && <Divider />}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default UserView
