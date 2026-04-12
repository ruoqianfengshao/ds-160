import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/DS-160/)
    
    // 检查主要内容
    await expect(page.getByText(/DS-160/i)).toBeVisible()
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    // 访问需要登录的页面
    await page.goto('/dashboard')
    
    // 应该重定向到登录页
    await page.waitForURL(/\/auth\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
