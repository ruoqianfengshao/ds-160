import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/DS-160/)
    
    // 检查登录表单元素
    await expect(page.getByRole('heading', { name: /登录|Sign in/i })).toBeVisible()
    await expect(page.getByPlaceholder(/邮箱|Email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码|Password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /登录|Sign in/i }).first()).toBeVisible()
  })

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login')
    
    // 填写错误的凭证
    await page.getByPlaceholder(/邮箱|Email/i).fill('invalid@example.com')
    await page.getByPlaceholder(/密码|Password/i).fill('wrongpassword')
    
    // 点击登录按钮（第一个，排除 Google 登录）
    await page.getByRole('button', { name: /^登录$|^Sign in$/i }).click()
    
    // 应该显示错误信息
    await expect(page.locator('text=/错误|失败|error|invalid|incorrect/i')).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login')
    
    // 点击注册链接
    await page.getByRole('link', { name: /注册|创建账号|create.*account|sign up/i }).click()
    
    // 应该跳转到注册页面
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup')
    
    // 检查注册表单元素
    await expect(page.getByPlaceholder(/邮箱|Email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码|Password/i)).toBeVisible()
  })
})
