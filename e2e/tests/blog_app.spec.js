const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Teppo Testaaja',
        username: 'Testi',
        password: 'salasana'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Toinen Käyttäjä',
        username: 'toinen',
        password: 'salasana'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Log in to application')).toBeVisible()

    await expect(page.locator('input').nth(0)).toBeVisible()

    await expect(page.locator('input').nth(1)).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Testi', 'salasana')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrong', 'wrong', false)

      await expect(page.getByText('wrong username/password')).toBeVisible()

      await expect(
        page.getByRole('button', { name: 'logout' })
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Testi', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Playwright blog',
        'Teppo Testaaja',
        'www.testi.fi'
      )

      const blog = page
        .locator('.blog')
        .filter({
          hasText: 'Playwright blog'
        })
        .first()

      await expect(blog).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Like test blog', 'Teppo Testaaja', 'www.testi.fi')

      const blog = page
        .locator('.blog')
        .filter({
          hasText: 'Like test blog'
        })
        .first()

      await expect(blog).toBeVisible()

      await blog.getByRole('link').click()

      const likeButton = page.getByRole('button', { name: 'like' })

      await likeButton.click()

      await expect(page.getByText('likes 1')).toBeVisible()

      await likeButton.click()

      await expect(page.getByText('likes 2')).toBeVisible()
    })

    test('a user can delete a blog', async ({ page }) => {
      await createBlog(
        page,
        'Delete test blog',
        'Teppo Testaaja',
        'www.testi.fi'
      )

      const blog = page
        .locator('.blog')
        .filter({
          hasText: 'Delete test blog'
        })
        .first()

      await expect(blog).toBeVisible()

      await blog.getByRole('link').click()

      page.on('dialog', (dialog) => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(blog).not.toBeVisible()
    })

    test('only the user who added the blog sees the remove button', async ({
      page
    }) => {
      await createBlog(
        page,
        'Permission test blog',
        'Teppo Testaaja',
        'www.testi.fi'
      )

      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'toinen', 'salasana')

      const blog = page
        .locator('.blog')
        .filter({
          hasText: 'Permission test blog'
        })
        .first()

      await page.getByRole('link', { name: /Permission test blog/ }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })
  })
})
