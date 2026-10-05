const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = lodash.countBy(blogs, 'author')

  const max = lodash.maxBy(Object.entries(counts), ([author, count]) => count)

  return {
    author: max[0],
    blogs: max[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = lodash.groupBy(blogs, 'author')

  const likesPerAuthor = Object.entries(grouped).map(([author, blogs]) => {
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return { author, likes: totalLikes }
  })

  return lodash.maxBy(likesPerAuthor, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
