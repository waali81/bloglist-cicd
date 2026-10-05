import { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent
} from '@mui/material'
import useUsersStore from '../stores/usersStore'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@mui/material'

const Users = () => {
  const users = useUsersStore((state) => state.users)
  const fetchUsers = useUsersStore((state) => state.fetchUsers)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Users
      </Typography>

      <Card sx={{ maxWidth: 900 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Username
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Blogs created
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>
                      <Link
                        component={RouterLink}
                        to={`/users/${user.id}`}
                        underline="hover"
                      >
                        {user.name}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.username}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.blogs.length}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

export default Users
