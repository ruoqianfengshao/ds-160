import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/DS-160/)
    
    // 检查登录表单元素（根据实际代码）
    await expect(page.getByRole('heading', { name: /Sign in to DS-160 Helper/i })).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible()
  })

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login')
    
    // 填写错误的凭证
    await page.getByPlaceholder('Email address').fill('invalid@example.com')
    await page.getByPlaceholder('Password').fill('wrongpassword')
    
    // 点击登录
    await page.getByRole('button', { name: /Sign in/i }).click()
    
    // 应该显示错误信息
    await expect(page.locator('text=/error|invalid|incorrect/i')).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login')
    
    // 点击注册链接（根据实际代码："create a new account"）
    await page.getByRole('link', { name: /create a new account/i }).click()
    
    // 应该跳转到注册页面
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup')
    
    // 检查注册表单元素
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
    await expect(page.getByPlaceholder(/Password/i)).toBeVisible()
  })
})
