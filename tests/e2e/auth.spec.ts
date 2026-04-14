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

  test('should show error or stay on page for invalid login', async ({ page }) => {
    await page.goto('/login')
    
    const initialUrl = page.url()
    
    // 填写错误的凭证
    await page.getByPlaceholder(/邮箱|Email/i).fill('invalid@example.com')
    await page.getByPlaceholder(/密码|Password/i).fill('wrongpassword')
    
    // 点击登录按钮
    await page.getByRole('button', { name: /^登录$|^Sign in$/i }).click()
    
    // 等待响应（要么显示错误，要么停留在登录页）
    await page.waitForTimeout(2000)
    
    // 应该仍在登录页（没有成功跳转）
    expect(page.url()).toBe(initialUrl)
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login')
    
    // 点击注册链接（使用 .first() 避免 strict mode violation）
    await page.getByRole('link', { name: /注册|创建.*账号|create.*account|sign.*up/i }).first().click()
    
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
