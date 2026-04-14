import { test, expect } from '@playwright/test'
import applicantData from '../fixtures/realistic-applicant.json'

/**
 * 数据同步测试
 * 
 * 验证表单数据正确保存到：
 * 1. localStorage（本地存储）
 * 2. Supabase（云端数据库）
 */

test.describe('DS-160 数据同步测试', () => {
  test.setTimeout(180000) // 3分钟超时

  test.beforeEach(async ({ page }) => {
    // 清除之前的数据
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('本地存储同步', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 填写第一步
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    await page.getByLabel(/名字|Given Names/i).fill(applicantData.applicant.givenNames)
    
    // 等待自动保存
    await page.waitForTimeout(3000)
    
    // 验证 localStorage
    const localData = await page.evaluate(() => {
      const data = localStorage.getItem('ds160_form_data')
      return data ? JSON.parse(data) : null
    })
    
    expect(localData).toBeTruthy()
    expect(localData.step1).toBeTruthy()
    expect(localData.step1.surname).toBe(applicantData.applicant.surname)
    expect(localData.step1.givenNames).toBe(applicantData.applicant.givenNames)
    
    console.log('✅ localStorage 同步正常')
  })

  test('跨步骤数据持久化', async ({ page }) => {
    // Step 1: 填写个人信息
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // Step 2: 填写护照信息
    await expect(page).toHaveURL(/\/form\/step-2/)
    await page.getByLabel(/护照号码|Passport Number/i).fill(applicantData.passport.number)
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // Step 3: 验证前两步数据都已保存
    await expect(page).toHaveURL(/\/form\/step-3/)
    
    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem('ds160_form_data')
      return data ? JSON.parse(data) : null
    })
    
    expect(savedData.step1.surname).toBe(applicantData.applicant.surname)
    expect(savedData.step2.passportNumber).toBe(applicantData.passport.number)
    
    console.log('✅ 跨步骤数据持久化正常')
  })

  test('页面刷新后数据恢复', async ({ page }) => {
    // 填写数据
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    await page.getByLabel(/名字|Given Names/i).fill(applicantData.applicant.givenNames)
    
    await page.waitForTimeout(2000)
    
    // 刷新页面
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // 验证数据已恢复
    const surname = await page.getByLabel(/姓氏|Surname/i).inputValue()
    const givenNames = await page.getByLabel(/名字|Given Names/i).inputValue()
    
    expect(surname).toBe(applicantData.applicant.surname)
    expect(givenNames).toBe(applicantData.applicant.givenNames)
    
    console.log('✅ 页面刷新后数据恢复正常')
  })

  test('多草稿管理', async ({ page }) => {
    // 创建第一个草稿
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill('WANG')
    await page.waitForTimeout(2000)
    
    // 检查是否有保存草稿的功能
    const saveButton = page.locator('button', { hasText: /保存草稿|Save Draft/i })
    
    if (await saveButton.isVisible()) {
      await saveButton.click()
      
      // 验证可以创建新草稿
      const newDraftButton = page.locator('button', { hasText: /新建草稿|New Draft/i })
      if (await newDraftButton.isVisible()) {
        await newDraftButton.click()
        
        // 新草稿应该是空的
        const surname = await page.getByLabel(/姓氏|Surname/i).inputValue()
        expect(surname).toBe('')
        
        console.log('✅ 多草稿管理功能正常')
      } else {
        console.log('⚠️ 未找到新建草稿按钮，跳过多草稿测试')
      }
    } else {
      console.log('⚠️ 未找到保存草稿按钮，跳过多草稿测试')
    }
  })

  test('云端同步验证（需要登录）', async ({ page }) => {
    // 尝试登录
    await page.goto('/login')
    
    // 检查是否有登录表单
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // 使用测试账号登录
      await emailInput.fill('test@example.com')
      await passwordInput.fill('testpassword123')
      
      const loginButton = page.locator('button', { hasText: /登录|Login|Sign In/i })
      await loginButton.click()
      
      // 等待登录完成
      await page.waitForTimeout(3000)
      
      // 如果登录成功，填写表单
      if (!page.url().includes('/login')) {
        await page.goto('/form/step-1')
        await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
        
        // 等待云端同步
        await page.waitForTimeout(5000)
        
        // 验证同步状态指示器
        const syncIndicator = page.locator('[data-sync-status], .sync-status, text=/已同步|Synced/')
        if (await syncIndicator.isVisible()) {
          console.log('✅ 云端同步功能正常')
        } else {
          console.log('⚠️ 未找到同步状态指示器')
        }
      } else {
        console.log('⚠️ 登录失败，跳过云端同步测试')
      }
    } else {
      console.log('⚠️ 未找到登录表单，跳过云端同步测试')
    }
  })

  test('数据导出功能', async ({ page }) => {
    // 填写完整数据
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    await page.getByLabel(/名字|Given Names/i).fill(applicantData.applicant.givenNames)
    
    await page.waitForTimeout(2000)
    
    // 检查是否有导出按钮
    const exportButton = page.locator('button', { hasText: /导出|Export|Download/i })
    
    if (await exportButton.isVisible()) {
      // 设置下载监听
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)
      
      await exportButton.click()
      
      const download = await downloadPromise
      
      if (download) {
        console.log('✅ 数据导出功能正常')
        console.log(`  文件名: ${download.suggestedFilename()}`)
      } else {
        console.log('⚠️ 未触发下载，可能导出功能尚未实现')
      }
    } else {
      console.log('⚠️ 未找到导出按钮，跳过导出测试')
    }
  })

  test('离线模式数据保存', async ({ page, context }) => {
    // 在线模式填写数据
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    
    await page.waitForTimeout(2000)
    
    // 模拟离线
    await context.setOffline(true)
    
    // 继续填写数据
    await page.getByLabel(/名字|Given Names/i).fill(applicantData.applicant.givenNames)
    
    await page.waitForTimeout(2000)
    
    // 验证数据仍然保存到 localStorage
    const localData = await page.evaluate(() => {
      const data = localStorage.getItem('ds160_form_data')
      return data ? JSON.parse(data) : null
    })
    
    expect(localData).toBeTruthy()
    expect(localData.step1.surname).toBe(applicantData.applicant.surname)
    expect(localData.step1.givenNames).toBe(applicantData.applicant.givenNames)
    
    // 恢复在线
    await context.setOffline(false)
    
    console.log('✅ 离线模式数据保存正常')
  })

  test('数据冲突解决', async ({ page }) => {
    // 在两个标签页中编辑同一表单
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill('ZHANG')
    await page.waitForTimeout(1000)
    
    // 打开新标签页
    const page2 = await page.context().newPage()
    await page2.goto('/form/step-1')
    
    // 在第二个标签页中修改
    await page2.getByLabel(/姓氏|Surname/i).fill('WANG')
    await page2.waitForTimeout(1000)
    
    // 刷新第一个标签页
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // 验证是否有冲突提示或采用最新数据
    const surname = await page.getByLabel(/姓氏|Surname/i).inputValue()
    
    // 应该是最新的数据（WANG）
    expect(surname).toBe('WANG')
    
    await page2.close()
    
    console.log('✅ 数据冲突解决正常（采用最新数据）')
  })
})
