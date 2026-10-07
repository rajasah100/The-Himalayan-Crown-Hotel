import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage renders hero and booking bar', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/The Himalayan Crown/)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Check availability' })).toBeVisible()
  })

  test('availability search lists rooms', async ({ page }) => {
    const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10)
    await page.goto(`http://localhost:3000/book?checkIn=${day(30)}&checkOut=${day(32)}&adults=2&rooms=1`)

    await expect(page.getByRole('button', { name: 'Select' }).first()).toBeVisible()
  })
})
