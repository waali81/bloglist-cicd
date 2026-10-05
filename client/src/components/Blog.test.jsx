import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogView from './BlogView'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

const blog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  user: {
    username: 'twaali',
    name: 'Timo Waali'
  }
}

describe('<BlogView />', () => {
  test('shows title, author, url and likes', () => {
    const user = null

    render(<BlogView blog={blog} user={user} />)

    expect(screen.getByText('React patterns')).toBeVisible()
    expect(screen.getByText(/Michael Chan/)).toBeVisible()
    expect(screen.getByText('https://reactpatterns.com/')).toBeVisible()
    expect(screen.getByText('likes 7')).toBeVisible()
  })

  test('non-owner user sees only like button', () => {
    const user = {
      username: 'someoneelse'
    }

    render(<BlogView blog={blog} user={user} />)

    expect(screen.getByText('like')).toBeVisible()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('like button is not shown for logged out user', () => {
    render(<BlogView blog={blog} user={null} />)

    expect(screen.queryByText('like')).toBeNull()
  })

  test('delete button is shown only for owner', () => {
    const ownerUser = {
      username: 'twaali'
    }

    const anotherUser = {
      username: 'someoneelse'
    }

    const { rerender } = render(<BlogView blog={blog} user={ownerUser} />)

    expect(screen.getByText('remove')).toBeVisible()

    rerender(<BlogView blog={blog} user={anotherUser} />)

    expect(screen.queryByText('remove')).toBeNull()
  })

  test('like button click calls handler twice', async () => {
    const user = { username: 'twaali' }
    const mockHandler = vi.fn()

    render(<BlogView blog={blog} user={user} handleLike={mockHandler} />)

    const userEventSetup = userEvent.setup()
    const button = screen.getByText('like')

    await userEventSetup.click(button)
    await userEventSetup.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

describe('<BlogForm />', () => {
  test('<BlogForm /> calls createBlog with correct data', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')

    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'React testing')
    await user.type(authorInput, 'Timo Waali')
    await user.type(urlInput, 'https://test.com')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'React testing',
      author: 'Timo Waali',
      url: 'https://test.com'
    })
  })
})
