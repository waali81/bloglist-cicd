import { create } from 'zustand'
import userService from '../services/users'

const useUsersStore = create((set) => ({
  users: [],

  fetchUsers: async () => {
    const users = await userService.getAll()
    set({ users })
  }
}))

export default useUsersStore
