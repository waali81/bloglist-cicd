import { Alert, Box } from '@mui/material'
import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification)

  if (!notification) {
    return null
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity={notification.type}>{notification.message}</Alert>
    </Box>
  )
}

export default Notification
