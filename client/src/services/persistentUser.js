const STORAGE_KEY = 'loggedBlogappUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(STORAGE_KEY)

  if (!userJSON) {
    return null
  }

  return JSON.parse(userJSON)
}

const saveUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export default {
  getUser,
  saveUser,
  removeUser
}
