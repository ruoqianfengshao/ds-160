import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/DS-160/)
    
    // 检查主要内容（可能包含 DS-160 或 Helper 字样）
    await expect(page.locator('body')).toContainText(/DS-160|Helper/i)
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')
    
    // 检查是否有登录/注册相关链接
    const loginLink = page.getByRole('link', { name: /login|sign in/i })
    const signupLink = page.getByRole('link', { name: /signup|sign up|register/i })
    
    // 至少应该有一个存在
    await expect(loginLink.or(signupLink).first()).toBeVisible()
  })
})
