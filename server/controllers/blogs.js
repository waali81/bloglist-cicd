const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user

      const blog = new Blog({
        ...request.body,
        user: user._id
      })

      const savedBlog = await blog.save()

      const populatedBlog = await savedBlog.populate('user', {
        username: 1,
        name: 1
      })

      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.status(201).json(populatedBlog)
    } catch (error) {
      next(error)
    }
  }
)

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user

      // hae blogi
      const blog = await Blog.findById(request.params.id)

      if (!blog) {
        return response.status(404).end()
      }

      // omistajuuden tarkistus
      if (blog.user.toString() !== user.id.toString()) {
        return response
          .status(401)
          .json({ error: 'not allowed to delete this blog' })
      }

      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } catch (error) {
      next(error)
    }
  }
)

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { returnDocument: 'after', runValidators: true }
    ).populate('user', { username: 1, name: 1 })

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    blog.comments = blog.comments.concat(request.body.comment)

    const updatedBlog = await blog.save()

    const populatedBlog = await updatedBlog.populate('user', {
      username: 1,
      name: 1
    })

    response.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
