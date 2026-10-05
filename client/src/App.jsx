import { useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Card,
  CardContent
} from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import persistentUser from './services/persistentUser'
import useField from './hooks/useField'
import Users from './components/Users'
import UserView from './components/UserView'
import useUsersStore from './stores/usersStore'
import Blogs from './components/Blogs'

const App = () => {
  const navigate = useNavigate()
  const username = useField('text')
  const password = useField('password')
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const logout = useUserStore((state) => state.logout)
  const blogFormRef = useRef()
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  )
  const blogs = useBlogStore((state) => state.blogs)
  const fetchBlogs = useBlogStore((state) => state.fetchBlogs)
  const createBlog = useBlogStore((state) => state.createBlog)
  const likeBlog = useBlogStore((state) => state.likeBlog)
  const deleteBlog = useBlogStore((state) => state.deleteBlog)
  const users = useUsersStore((state) => state.users)
  const addComment = useBlogStore((state) => state.addComment)

  // hae blogit
  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  // käyttäjän haku localstoragesta
  useEffect(() => {
    const user = persistentUser.getUser()

    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [setUser])

  // login handler
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: username.inputProps.value,
        password: password.inputProps.value
      })

      // tallennus localstorageen
      persistentUser.saveUser(user)

      blogService.setToken(user.token)

      setUser(user)
      navigate('/')
    } catch {
      showNotification('wrong username/password', 'error')
    } finally {
      username.reset()
      password.reset()
    }
  }

  // logout handler
  const handleLogout = () => {
    persistentUser.removeUser()
    logout()
    navigate('/')
  }

  // comment handler
  const handleAddComment = async (id, comment) => {
    await addComment(id, comment)
  }

  // blogin luonti handler
  const handleCreateBlog = async (blogObject) => {
    const createdBlog = await createBlog(blogObject)

    showNotification(
      `a new blog '${createdBlog.title}' by ${createdBlog.author} added`,
      'success'
    )

    navigate('/')

    blogFormRef.current?.toggleVisibility()
  }

  // like handler
  const handleLike = async (blog) => {
    await likeBlog(blog)
  }

  // delete handler
  const handleDelete = async (blog) => {
    const ok = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)

    if (!ok) {
      return
    }

    await deleteBlog(blog)

    navigate('/')
  }
  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null

  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

  return (
    <div>
      {/* NAVIGATION */}
      <AppBar position="static">
        <Toolbar>
          {/* vasen puoli: otsikko */}
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          {/* navigaatio */}
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>

          <Button color="inherit" component={Link} to="/users">
            users
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/create">
              create blog
            </Button>
          )}

          {!user && (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification />
      <ErrorBoundary>
        {/* ROUTES */}
        <Routes>
          {/* BLOG VIEW */}
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                handleAddComment={handleAddComment}
              />
            }
          />

          {/* CREATE BLOG */}
          <Route
            path="/create"
            element={
              user ? (
                <BlogForm createBlog={handleCreateBlog} />
              ) : (
                <div>not authorized</div>
              )
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                password={password}
              />
            }
          />

          <Route path="/users/:id" element={<UserView user={selectedUser} />} />

          <Route path="/users" element={<Users />} />

          {/* BLOG LIST */}
          <Route path="/" element={<Blogs blogs={blogs} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
