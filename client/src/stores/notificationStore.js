import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: null,

  showNotification: (message, type = 'success', seconds = 5) => {
    set({
      notification: { message, type }
    })

    setTimeout(() => {
      set({ notification: null })
    }, seconds * 1000)
  }
}))

export default useNotificationStore
