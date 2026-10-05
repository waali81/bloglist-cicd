import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],

  fetchBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  createBlog: async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)

    set((state) => ({
      blogs: state.blogs.concat(createdBlog)
    }))

    return createdBlog
  },

  likeBlog: async (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    set((state) => ({
      blogs: state.blogs.map((b) => (b.id === blog.id ? returnedBlog : b))
    }))
  },

  deleteBlog: async (blog) => {
    await blogService.remove(blog.id)

    set((state) => ({
      blogs: state.blogs.filter((b) => b.id !== blog.id)
    }))
  },

  addComment: async (id, comment) => {
    const updatedBlog = await blogService.addComment(id, comment)

    set((state) => ({
      blogs: state.blogs.map((blog) => (blog.id === id ? updatedBlog : blog))
    }))
  }
}))

export default useBlogStore
