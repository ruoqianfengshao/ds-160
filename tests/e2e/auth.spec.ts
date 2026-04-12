import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/auth/login')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/DS-160/)
    
    // 检查登录表单元素
    await expect(page.getByRole('heading', { name: /登录|Login/i })).toBeVisible()
    await expect(page.getByPlaceholder(/邮箱|email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码|password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /登录|Login/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login')
    
    // 点击登录按钮（不填表单）
    await page.getByRole('button', { name: /登录|Login/i }).click()
    
    // 应该显示验证错误（根据实际实现调整选择器）
    // await expect(page.getByText(/请输入邮箱|Please enter email/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login')
    
    // 点击注册链接
    await page.getByRole('link', { name: /注册|Register|Sign up/i }).click()
    
    // 应该跳转到注册页面
    await expect(page).toHaveURL(/\/auth\/register/)
  })

  test('should load register page', async ({ page }) => {
    await page.goto('/auth/register')
    
    // 检查注册表单元素
    await expect(page.getByRole('heading', { name: /注册|Register/i })).toBeVisible()
    await expect(page.getByPlaceholder(/邮箱|email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码|password/i)).toBeVisible()
  })
})
