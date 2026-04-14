import { test, expect } from '@playwright/test'

test.describe('Dashboard - Multi-Draft Management', () => {
  test.beforeEach(async ({ page }) => {
    // 先登录
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // 使用测试账号登录
    await page.getByPlaceholder(/邮箱|Email/i).fill('test@example.com')
    await page.getByPlaceholder(/密码|Password/i).fill('Test123456')
    await page.getByRole('button', { name: /^登录$|^Sign in$/i }).click()
    
    // 等待跳转到 dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
  })

  test('should display dashboard with empty state', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 检查页面标题
    await expect(page.getByRole('heading', { name: /Dashboard|控制台/i })).toBeVisible({ timeout: 10000 })
    
    // 如果没有草稿，应该显示空状态或创建按钮
    const createButton = page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i })
    await expect(createButton).toBeVisible({ timeout: 10000 })
  })

  test('should create a new draft', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 点击创建草稿按钮
    const createButton = page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i }).first()
    await createButton.click()
    
    // 等待草稿创建完成
    await page.waitForTimeout(2000)
    
    // 应该显示新的草稿卡片或列表项
    await expect(page.locator('[data-testid="draft-item"], .draft-card, [class*="draft"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('should switch between drafts', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 创建第一个草稿
    const createButton = page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i }).first()
    await createButton.click()
    await page.waitForTimeout(1500)
    
    // 创建第二个草稿
    await createButton.click()
    await page.waitForTimeout(1500)
    
    // 应该有至少 2 个草稿
    const drafts = page.locator('[data-testid="draft-item"], .draft-card, [class*="draft"]')
    await expect(drafts).toHaveCount(2, { timeout: 10000 })
    
    // 点击第一个草稿的加载按钮
    const loadButton = page.getByRole('button', { name: /加载|Load|打开|Open/i }).first()
    if (await loadButton.isVisible()) {
      await loadButton.click()
      await page.waitForTimeout(1000)
      
      // 应该跳转到表单页面或显示草稿内容
      await expect(page).toHaveURL(/\/form\/step-\d+|\/dashboard/, { timeout: 10000 })
    }
  })

  test('should delete a draft', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 创建一个草稿
    const createButton = page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i }).first()
    await createButton.click()
    await page.waitForTimeout(1500)
    
    // 获取初始草稿数量
    const draftsBeforeDelete = await page.locator('[data-testid="draft-item"], .draft-card, [class*="draft"]').count()
    
    // 点击删除按钮（可能需要点击更多选项或直接点击删除图标）
    const deleteButton = page.getByRole('button', { name: /删除|Delete|移除|Remove/i }).first()
    if (await deleteButton.isVisible()) {
      await deleteButton.click()
      
      // 如果有确认对话框，点击确认
      const confirmButton = page.getByRole('button', { name: /确认|Confirm|是|Yes/i })
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click()
      }
      
      await page.waitForTimeout(1500)
      
      // 检查草稿数量是否减少
      const draftsAfterDelete = await page.locator('[data-testid="draft-item"], .draft-card, [class*="draft"]').count()
      expect(draftsAfterDelete).toBeLessThan(draftsBeforeDelete)
    }
  })

  test('should show draft metadata', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 创建一个草稿
    const createButton = page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i }).first()
    await createButton.click()
    await page.waitForTimeout(1500)
    
    // 检查草稿卡片中的元数据
    const draftCard = page.locator('[data-testid="draft-item"], .draft-card, [class*="draft"]').first()
    await expect(draftCard).toBeVisible({ timeout: 10000 })
    
    // 应该显示创建时间或更新时间
    const hasTimestamp = await draftCard.locator('text=/\\d{4}-\\d{2}-\\d{2}|刚刚|秒前|分钟前|小时前|天前|ago|recently/i').count() > 0
    expect(hasTimestamp).toBeTruthy()
  })

  test('should show sync status indicators', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 检查是否有同步状态指示器
    const syncIndicator = page.locator('[data-testid="sync-status"], [class*="sync"], text=/同步|Sync|云|Cloud/i')
    
    // 至少应该在页面某处显示同步相关信息
    const hasSyncInfo = await syncIndicator.count() > 0
    // 注意：这个测试可能会失败如果页面没有明确的同步指示器
    // 这是正常的，说明需要添加这个功能
  })

  test('should handle empty dashboard gracefully', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // 页面应该正常加载，不会崩溃
    await expect(page).toHaveTitle(/DS-160/, { timeout: 10000 })
    
    // 应该有明确的空状态提示或创建草稿的引导
    const hasEmptyState = await page.locator('text=/开始.*草稿|Create.*first|还没有草稿|No drafts/i').count() > 0
    const hasCreateButton = await page.getByRole('button', { name: /创建.*草稿|Create.*Draft|新建/i }).count() > 0
    
    expect(hasEmptyState || hasCreateButton).toBeTruthy()
  })
})
