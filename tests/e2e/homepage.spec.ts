import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/DS-160/)
    
    // 检查主要内容（可能包含 DS-160 或 助手 字样）
    await expect(page.locator('body')).toContainText(/DS-160|助手|Helper/i)
  })

  test('should have navigation in header', async ({ page }) => {
    await page.goto('/')
    
    // 检查页面中是否存在 header 导航（不一定是link，可能在header里）
    const header = page.locator('header, nav, [role="banner"]')
    await expect(header.first()).toBeVisible()
    
    // 检查是否有文字链接或按钮（登录/注册/助手等）
    await expect(page.locator('body')).toContainText(/登录|注册|Login|Sign.*up|DS-160/i)
  })
})
