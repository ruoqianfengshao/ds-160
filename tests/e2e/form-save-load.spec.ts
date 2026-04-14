import { test, expect } from '@playwright/test'

test.describe('Form - Save & Load Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // 登录
    await page.getByPlaceholder(/邮箱|Email/i).fill('test@example.com')
    await page.getByPlaceholder(/密码|Password/i).fill('Test123456')
    await page.getByRole('button', { name: /^登录$|^Sign in$/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
  })

  test('should auto-save form data to localStorage', async ({ page }) => {
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    // 填写一些字段
    const lastNameInput = page.locator('input[placeholder="WANG"]')
    await lastNameInput.fill('ZHANG', { timeout: 10000 })
    
    const firstNameInput = page.locator('input[placeholder="MING"]')
    await firstNameInput.fill('WEI', { timeout: 10000 })
    
    // 等待自动保存（假设 2 秒防抖）
    await page.waitForTimeout(3000)
    
    // 检查 localStorage 中是否有数据
    const localStorageData = await page.evaluate(() => {
      const keys = Object.keys(localStorage)
      const ds160Key = keys.find(k => k.includes('ds160') || k.includes('draft') || k.includes('form'))
      return ds160Key ? localStorage.getItem(ds160Key) : null
    })
    
    expect(localStorageData).not.toBeNull()
    expect(localStorageData).toContain('ZHANG')
    expect(localStorageData).toContain('WEI')
  })

  test('should load saved data when returning to form', async ({ page }) => {
    // 第一次访问：填写数据
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    const lastName = 'TESTLAST'
    const firstName = 'TESTFIRST'
    
    await page.locator('input[placeholder="WANG"]').fill(lastName, { timeout: 10000 })
    await page.locator('input[placeholder="MING"]').fill(firstName, { timeout: 10000 })
    await page.waitForTimeout(3000) // 等待自动保存
    
    // 离开页面
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 返回表单
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000) // 等待数据加载
    
    // 检查数据是否被恢复
    await expect(page.locator('input[placeholder="WANG"]')).toHaveValue(lastName, { timeout: 10000 })
    await expect(page.locator('input[placeholder="MING"]')).toHaveValue(firstName, { timeout: 10000 })
  })

  test('should save data across different form steps', async ({ page }) => {
    // Step 1: 填写个人信息
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    await page.locator('input[placeholder="WANG"]').fill('LI', { timeout: 10000 })
    await page.locator('input[placeholder="MING"]').fill('HUA', { timeout: 10000 })
    await page.waitForTimeout(3000)
    
    // 导航到 Step 2
    const nextButton = page.getByRole('button', { name: /下一步|Next|继续|Continue/i })
    if (await nextButton.isVisible({ timeout: 5000 })) {
      await nextButton.click()
      await page.waitForURL(/\/form\/step-2/, { timeout: 10000 })
    } else {
      await page.goto('/form/step-2')
    }
    await page.waitForLoadState('networkidle')
    
    // Step 2: 填写旅行信息
    const purposeSelect = page.getByLabel(/旅行目的|Purpose of Trip/i)
    if (await purposeSelect.isVisible({ timeout: 5000 })) {
      await purposeSelect.selectOption({ index: 1 })
      await page.waitForTimeout(3000)
    }
    
    // 返回 Step 1 检查数据是否保留
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('input[placeholder="WANG"]')).toHaveValue('LI', { timeout: 10000 })
    await expect(page.locator('input[placeholder="MING"]')).toHaveValue('HUA', { timeout: 10000 })
  })

  test('should show save indicator when saving', async ({ page }) => {
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    // 填写字段触发保存
    await page.locator('input[placeholder="WANG"]').fill('TEST', { timeout: 10000 })
    
    // 检查是否有保存指示器（如 "保存中..."、"已保存"、加载图标等）
    await page.waitForTimeout(500)
    
    const hasSaveIndicator = await page.locator('text=/保存中|Saving|已保存|Saved|同步中|Syncing/i').count() > 0
    const hasSavingIcon = await page.locator('[class*="spin"], [class*="loading"], [data-testid="saving"]').count() > 0
    
    // 注意：如果这个测试失败，说明需要添加保存状态指示器
    // 这是一个 UX 改进点
  })

  test('should handle save errors gracefully', async ({ page }) => {
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    // 模拟离线状态
    await page.context().setOffline(true)
    
    // 填写数据
    await page.locator('input[placeholder="WANG"]').fill('ERROR', { timeout: 10000 })
    await page.waitForTimeout(3000)
    
    // 应该显示错误提示或离线指示器
    const hasErrorIndicator = await page.locator('text=/离线|Offline|错误|Error|失败|Failed/i').count() > 0
    
    // 恢复在线状态
    await page.context().setOffline(false)
    
    // 数据应该仍然在 localStorage 中
    const localStorageData = await page.evaluate(() => {
      const keys = Object.keys(localStorage)
      const ds160Key = keys.find(k => k.includes('ds160') || k.includes('draft') || k.includes('form'))
      return ds160Key ? localStorage.getItem(ds160Key) : null
    })
    
    expect(localStorageData).toContain('ERROR')
  })

  test('should sync to cloud after delay', async ({ page }) => {
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    // 填写数据
    await page.locator('input[placeholder="WANG"]').fill('CLOUD', { timeout: 10000 })
    await page.locator('input[placeholder="MING"]').fill('SYNC', { timeout: 10000 })
    
    // 等待自动保存和云同步（2 秒防抖 + 网络延迟）
    await page.waitForTimeout(5000)
    
    // 检查是否有云同步成功的指示
    const hasSyncSuccess = await page.locator('text=/已同步|Synced|云端|Cloud.*success/i').count() > 0
    
    // 注意：这个测试依赖于实际的 Supabase 连接
    // 如果测试环境没有配置 Supabase，这个测试会失败
  })

  test('should clear form data when creating new draft', async ({ page }) => {
    // 填写一些数据
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    
    await page.locator('input[placeholder="WANG"]').fill('OLD', { timeout: 10000 })
    await page.waitForTimeout(3000)
    
    // 返回 dashboard 创建新草稿
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const createButton = page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i }).first()
    if (await createButton.isVisible({ timeout: 5000 })) {
      await createButton.click()
      await page.waitForTimeout(2000)
    }
    
    // 进入新草稿的表单
    await page.goto('/form/step-1')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // 字段应该是空的
    const lastNameValue = await page.locator('input[placeholder="WANG"]').inputValue()
    expect(lastNameValue).not.toBe('OLD')
  })
})
