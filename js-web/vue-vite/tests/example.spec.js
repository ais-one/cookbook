const { test, expect } = require('@playwright/test')

test.describe('New Todo', () => {
  test('basic test', async ({ page }) => {
    await page.goto('/')

    await page.locator('text=Mock').click()
    await page.waitForURL('**/signin-fast') // need timeout
    await expect(page.url()).toEqual(`http://localhost:8080/signin-fast`)

    await page.locator('text=Log in').click()
    await page.waitForURL('**/dashboard') // need timeout
    await expect(page.url()).toEqual(`http://localhost:8080/dashboard`)

    // console.log(page.url())
    // await page.waitForTimeout(2000)
    // await page.waitForNavigation()
    // Get page after a specific action (e.g. clicking a link)
    // await page.goto('https://playwright.dev/')
    // const title = page.locator('.navbar__inner .navbar__title')
    // await expect(title).toHaveText('Playwright')
  })
})
