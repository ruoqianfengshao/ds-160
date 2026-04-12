import { test, expect } from '@playwright/test'

test.describe('DS-160 Form Fields Mapping', () => {
  test.beforeEach(async ({ page }) => {
    // 假设需要登录后才能访问表单
    // 这里先访问 Step 1，如果需要登录会自动跳转
    await page.goto('/form/step-1')
    
    // 如果跳转到登录页，先登录
    if (page.url().includes('/login')) {
      await page.getByPlaceholder(/邮箱|Email/i).fill('test@example.com')
      await page.getByPlaceholder(/密码|Password/i).fill('testpassword123')
      await page.getByRole('button', { name: /^登录$|^Sign in$/i }).click()
      await page.waitForTimeout(2000)
    }
  })

  test('Step 1: Personal Information - 基础字段存在', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 检查必填字段
    await expect(page.getByLabel(/姓氏|Surname|Family Name/i)).toBeVisible()
    await expect(page.getByLabel(/名字|Given Name|First Name/i)).toBeVisible()
    await expect(page.getByLabel(/出生日期|Date of Birth/i)).toBeVisible()
    await expect(page.getByLabel(/性别|Gender/i)).toBeVisible()
    await expect(page.getByLabel(/婚姻状况|Marital Status/i)).toBeVisible()
  })

  test('Step 1: 曾用名联动逻辑 (R1.1)', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 初始状态："其他名字"表单不可见
    const otherNamesSection = page.locator('text=/Other Name|其他名字|曾用名/i').first()
    await expect(otherNamesSection).toBeHidden()
    
    // 勾选"曾用其他名字"
    const hasOtherNamesCheckbox = page.getByLabel(/Have you ever used other names|曾用其他名字/i)
    await hasOtherNamesCheckbox.check()
    
    // 现在应该显示"其他名字"输入区域
    await expect(otherNamesSection).toBeVisible()
    
    // 应该至少有一个"其他名字"输入框
    await expect(page.getByLabel(/Other Name.*Surname|其他名字.*姓氏/i).first()).toBeVisible()
    await expect(page.getByLabel(/Other Name.*Given Name|其他名字.*名字/i).first()).toBeVisible()
  })

  test('Step 2: Travel Information - 基础字段存在', async ({ page }) => {
    await page.goto('/form/step-2')
    
    // 检查旅行信息字段
    await expect(page.getByLabel(/旅行目的|Purpose of Trip/i)).toBeVisible()
    await expect(page.getByLabel(/计划到达日期|Intended.*Arrival/i)).toBeVisible()
    await expect(page.getByLabel(/计划停留时长|Length of Stay/i)).toBeVisible()
    
    // 美国地址字段
    await expect(page.getByLabel(/街道地址|Street Address/i)).toBeVisible()
    await expect(page.getByLabel(/城市|City/i)).toBeVisible()
    await expect(page.getByLabel(/州|State/i)).toBeVisible()
    await expect(page.getByLabel(/邮编|Zip.*Code/i)).toBeVisible()
  })

  test('Step 2: 支付者联动逻辑 (R2.2)', async ({ page }) => {
    await page.goto('/form/step-2')
    
    // 选择"Self"支付
    const payerSelect = page.getByLabel(/谁支付旅费|Who is paying/i)
    await payerSelect.selectOption('Self')
    
    // 支付者信息应该隐藏
    const payerInfoSection = page.locator('text=/支付者信息|Payer.*Information/i')
    await expect(payerInfoSection).toBeHidden()
    
    // 选择"Other Person"
    await payerSelect.selectOption(/Other|其他人/)
    
    // 现在应该显示支付者信息
    await expect(payerInfoSection).toBeVisible()
    await expect(page.getByLabel(/支付者姓名|Payer.*Name/i)).toBeVisible()
  })

  test('Step 3: 同行者联动逻辑 (R3.1)', async ({ page }) => {
    await page.goto('/form/step-3')
    
    // 选择"No" - 不与他人同行
    await page.getByLabel(/No|否/i).check()
    
    // 同行者列表应该隐藏
    const companionsSection = page.locator('text=/同行者|Companions/i')
    await expect(companionsSection).toBeHidden()
    
    // 选择"Yes" - 与他人同行
    await page.getByLabel(/Yes|是/i).check()
    
    // 现在应该显示同行者输入区域
    await expect(companionsSection).toBeVisible()
    await expect(page.getByLabel(/姓名|Full Name/i).first()).toBeVisible()
    await expect(page.getByLabel(/关系|Relationship/i).first()).toBeVisible()
  })

  test('Step 4: 上次访美联动逻辑 (R4.1)', async ({ page }) => {
    await page.goto('/form/step-4')
    
    // 选择"No" - 没去过美国
    await page.getByLabel(/No|否/i).first().check()
    
    // 访美记录应该隐藏
    const previousTripsSection = page.locator('text=/Previous.*Trip|上次访美/i')
    await expect(previousTripsSection).toBeHidden()
    
    // 选择"Yes" - 去过美国
    await page.getByLabel(/Yes|是/i).first().check()
    
    // 现在应该显示访美记录输入区域
    await expect(previousTripsSection).toBeVisible()
    await expect(page.getByLabel(/到达日期|Date of Arrival/i).first()).toBeVisible()
    await expect(page.getByLabel(/停留时长|Length of Stay/i).first()).toBeVisible()
  })

  test('Step 6: 护照有效期验证 (R6.1)', async ({ page }) => {
    await page.goto('/form/step-6')
    
    // 填写护照信息
    await page.getByLabel(/护照号|Passport Number/i).fill('E12345678')
    
    // 填写一个快要到期的日期（3个月后）
    const threeMonthsLater = new Date()
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    const dateString = threeMonthsLater.toISOString().split('T')[0]
    
    await page.getByLabel(/到期日期|Expiration Date/i).fill(dateString)
    
    // 触发验证（尝试点击"下一步"按钮）
    const nextButton = page.getByRole('button', { name: /下一步|Next|Continue/i })
    await nextButton.click()
    
    // 应该显示错误提示
    await expect(page.locator('text=/护照有效期.*6.*月|passport.*valid.*6.*month/i')).toBeVisible({ timeout: 5000 })
  })

  test('Step 7: 婚姻状况联动逻辑 (R7.1)', async ({ page }) => {
    await page.goto('/form/step-7')
    
    // 检查父母信息字段存在
    await expect(page.getByLabel(/父亲.*姓名|Father.*Name/i)).toBeVisible()
    await expect(page.getByLabel(/母亲.*姓名|Mother.*Name/i)).toBeVisible()
    
    // 如果已婚，应该显示配偶信息
    // 这里假设在 Step 1 选择了"Married"
    const spouseSection = page.locator('text=/配偶|Spouse/i')
    
    // 可能可见也可能不可见，取决于 Step 1 的选择
    // 这里只检查字段是否存在于 DOM 中
    const spouseExists = await spouseSection.count() > 0
    expect(spouseExists).toBeTruthy()
  })

  test('Step 8: 职业联动逻辑 (R8.1)', async ({ page }) => {
    await page.goto('/form/step-8')
    
    // 选择"Student"
    await page.getByLabel(/当前职业|Current Occupation/i).selectOption(/Student|学生/)
    
    // 雇主信息应该隐藏
    const employerSection = page.locator('text=/雇主|Employer/i')
    await expect(employerSection).toBeHidden()
    
    // 选择"Employed"
    await page.getByLabel(/当前职业|Current Occupation/i).selectOption(/Employed|在职/)
    
    // 现在应该显示雇主信息
    await expect(employerSection).toBeVisible()
    await expect(page.getByLabel(/雇主名称|Employer.*Name/i)).toBeVisible()
    await expect(page.getByLabel(/职位|Position/i)).toBeVisible()
  })

  test('Step 9: 安全问题字段存在', async ({ page }) => {
    await page.goto('/form/step-9')
    
    // 检查关键安全问题
    await expect(page.locator('text=/传染病|contagious.*disease/i')).toBeVisible()
    await expect(page.locator('text=/精神疾病|mental.*disorder/i')).toBeVisible()
    await expect(page.locator('text=/逮捕|arrested/i')).toBeVisible()
    await expect(page.locator('text=/签证|visa/i')).toBeVisible()
    await expect(page.locator('text=/恐怖|terrorism/i')).toBeVisible()
    
    // 所有问题都应该有 Yes/No 选项
    const yesButtons = page.getByLabel(/Yes|是/i)
    const noButtons = page.getByLabel(/No|否/i)
    
    expect(await yesButtons.count()).toBeGreaterThan(5)
    expect(await noButtons.count()).toBeGreaterThan(5)
  })

  test('Step 10: 照片上传字段存在', async ({ page }) => {
    await page.goto('/form/step-10')
    
    // 检查照片上传区域
    await expect(page.locator('input[type="file"]')).toBeVisible()
    await expect(page.locator('text=/上传照片|Upload Photo/i')).toBeVisible()
    
    // 检查照片要求说明
    await expect(page.locator('text=/600.*600|2.*2.*inch/i')).toBeVisible()
    await expect(page.locator('text=/240.*KB/i')).toBeVisible()
  })

  test('完整流程：填写所有必填字段', async ({ page }) => {
    // Step 1: Personal Information
    await page.goto('/form/step-1')
    await page.getByLabel(/姓氏|Surname/i).fill('ZHANG')
    await page.getByLabel(/名字|Given Name/i).fill('SAN')
    await page.getByLabel(/出生日期|Date of Birth/i).fill('1990-01-01')
    await page.getByLabel(/出生城市|City of Birth/i).fill('Beijing')
    await page.getByLabel(/性别|Gender/i).check({ force: true }) // 选择第一个选项
    
    // 点击"下一步"
    await page.getByRole('button', { name: /下一步|Next|Continue/i }).click()
    
    // 应该跳转到 Step 2
    await expect(page).toHaveURL(/\/form\/step-2/)
    
    // Step 2: Travel Information
    await page.getByLabel(/旅行目的|Purpose/i).selectOption(/Tourism|旅游/)
    await page.getByLabel(/计划到达日期|Arrival/i).fill('2026-06-01')
    await page.getByLabel(/计划停留时长|Length/i).fill('14')
    
    // 填写美国地址
    await page.getByLabel(/街道|Street/i).fill('123 Main St')
    await page.getByLabel(/城市|City/i).fill('New York')
    await page.getByLabel(/州|State/i).selectOption('NY')
    await page.getByLabel(/邮编|Zip/i).fill('10001')
    
    await page.getByRole('button', { name: /下一步|Next/i }).click()
    
    // 应该成功跳转到 Step 3
    await expect(page).toHaveURL(/\/form\/step-3/)
  })

  test('导航栏显示当前步骤', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 检查导航栏是否存在
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav).toBeVisible()
    
    // 当前步骤应该高亮显示
    await expect(page.locator('text=/Step 1|第 1 步/i')).toBeVisible()
  })

  test('数据持久化：刷新页面后数据仍在', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 填写一些数据
    const testSurname = 'TEST_SURNAME_' + Date.now()
    await page.getByLabel(/姓氏|Surname/i).fill(testSurname)
    
    // 等待自动保存（假设有自动保存功能）
    await page.waitForTimeout(1000)
    
    // 刷新页面
    await page.reload()
    
    // 数据应该还在
    const surnameInput = page.getByLabel(/姓氏|Surname/i)
    await expect(surnameInput).toHaveValue(testSurname)
  })
})
