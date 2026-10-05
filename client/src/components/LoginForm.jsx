import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({ handleLogin, username, password }) => {
  return (
    <Box sx={{ maxWidth: 300, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Log in to application
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="username"
          margin="normal"
          autoComplete="username"
          {...username.inputProps}
        />

        <TextField
          fullWidth
          label="password"
          margin="normal"
          autoComplete="current-password"
          {...password.inputProps}
        />

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          login
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
