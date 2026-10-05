const loginWith = async (page, username, password, expectSuccess = true) => {
  await page.goto('/login')
  await page.locator('input').nth(0).fill(username)
  await page.locator('input').nth(1).fill(password)
  await page.getByRole('button', { name: 'login' }).click()

  if (expectSuccess) {
    await page.getByRole('button', { name: 'logout' }).waitFor()
  }
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create blog' }).click()

  await page.locator('input').nth(0).fill(title)
  await page.locator('input').nth(1).fill(author)
  await page.locator('input').nth(2).fill(url)

  await page.getByRole('button', { name: 'create' }).click()
}

module.exports = {
  loginWith,
  createBlog
}
