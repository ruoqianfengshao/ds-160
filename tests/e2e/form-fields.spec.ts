import { test, expect } from '@playwright/test'

test.describe('DS-160 Form Fields - 完整测试', () => {
  test('Step 1: 个人信息 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 检查必填字段（使用更精确的选择器）
    await expect(page.locator('input[placeholder="WANG"]')).toBeVisible() // 姓
    await expect(page.locator('input[placeholder="MING"]')).toBeVisible() // 名
    await expect(page.getByLabel(/出生日期|Date of Birth/i)).toBeVisible()
    await expect(page.getByLabel(/出生城市|City of Birth/i)).toBeVisible()
    await expect(page.getByLabel(/出生国家|Country.*Birth/i)).toBeVisible()
    await expect(page.getByLabel(/国籍|Nationality/i)).toBeVisible()
  })

  test('Step 1: 曾用名联动逻辑', async ({ page }) => {
    await page.goto('/form/step-1')
    
    const hasOtherNamesCheckbox = page.getByLabel(/曾用其他名字|other names/i)
    await expect(hasOtherNamesCheckbox).toBeVisible()
    await hasOtherNamesCheckbox.check()
    await page.waitForTimeout(300)
  })

  test('Step 2: 旅行信息 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-2')
    
    // 旅行信息字段
    await expect(page.getByLabel(/旅行目的|Purpose of Trip/i)).toBeVisible()
    await expect(page.getByLabel(/计划到达日期|Intended.*Arrival/i)).toBeVisible()
    await expect(page.getByLabel(/计划停留时长|Length of Stay/i)).toBeVisible()
    
    // 在美地址
    await expect(page.getByLabel(/街道地址|Street Address/i)).toBeVisible()
    await expect(page.getByLabel(/城市|City/i)).toBeVisible()
    await expect(page.getByLabel(/州|State/i)).toBeVisible()
    await expect(page.getByLabel(/邮编|Zip.*Code/i)).toBeVisible()
    
    // 费用支付
    await expect(page.getByLabel(/谁.*付费|Who.*paying/i)).toBeVisible()
  })

  test('Step 2: 费用支付联动逻辑', async ({ page }) => {
    await page.goto('/form/step-2')
    
    // 选择"其他人支付"（使用 selectOption 的 label 匹配）
    const payerSelect = page.getByLabel(/谁.*付费|Who.*paying/i)
    await payerSelect.selectOption({ label: /其他个人|Other Person/i })
    await page.waitForTimeout(500)
    
    // 应该显示支付者信息字段（使用 text 定位标题）
    await expect(page.locator('text=/支付者信息|Payer Information/i')).toBeVisible({ timeout: 3000 })
  })

  test('Step 3: 旅行同伴 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-3')
    
    // 同行者选项
    await expect(page.getByLabel(/是否.*同行|traveling with/i)).toBeVisible()
    await expect(page.getByLabel(/团组|group.*organization/i)).toBeVisible()
  })

  test('Step 3: 同行者联动逻辑', async ({ page }) => {
    await page.goto('/form/step-3')
    
    // 勾选"有同行者"
    const hasCompanionsCheckbox = page.getByLabel(/是否.*同行|traveling with/i)
    await hasCompanionsCheckbox.check()
    await page.waitForTimeout(500)
    
    // 应该显示同行人信息字段（使用标题定位）
    await expect(page.locator('text=/同行人员信息|Companion.*Information/i')).toBeVisible({ timeout: 3000 })
  })

  test('Step 4: 前次美国旅行 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-4')
    
    // 访美记录
    await expect(page.getByLabel(/曾.*去过美国|been to.*US/i)).toBeVisible()
    await expect(page.getByLabel(/获得.*签证|issued.*visa/i)).toBeVisible()
    await expect(page.getByLabel(/被拒签|refused.*visa/i)).toBeVisible()
    await expect(page.getByLabel(/拒绝入境|refused.*entry/i)).toBeVisible()
  })

  test('Step 4: 访美记录联动逻辑', async ({ page }) => {
    await page.goto('/form/step-4')
    
    // 勾选"去过美国"
    const hasBeenToUSCheckbox = page.getByLabel(/曾.*去过美国|been to.*US/i)
    await hasBeenToUSCheckbox.check()
    await page.waitForTimeout(300)
    
    // 应该显示访美详情字段
    await expect(page.getByLabel(/最近.*到达|Last Arrival/i)).toBeVisible({ timeout: 3000 })
  })

  test('Step 5: 联系地址 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-5')
    
    // 家庭住址
    await expect(page.getByLabel(/街道地址|Street Address/i)).toBeVisible()
    await expect(page.getByLabel(/城市|City/i)).toBeVisible()
    await expect(page.getByLabel(/省份|Province|State/i)).toBeVisible()
    await expect(page.getByLabel(/邮编|Postal.*Code/i)).toBeVisible()
    
    // 联系方式
    await expect(page.getByLabel(/主要电话|Primary Phone/i)).toBeVisible()
    await expect(page.getByLabel(/电子邮箱|Email/i)).toBeVisible()
  })

  test('Step 6: 护照信息 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-6')
    
    // 护照字段
    await expect(page.getByLabel(/护照号|Passport Number/i)).toBeVisible()
    await expect(page.getByLabel(/签发国|Country.*Issuance/i)).toBeVisible()
    await expect(page.getByLabel(/签发城市|City.*Issued/i)).toBeVisible()
    await expect(page.getByLabel(/签发日期|Issuance Date/i)).toBeVisible()
    await expect(page.getByLabel(/到期日期|Expiration Date/i)).toBeVisible()
    await expect(page.getByLabel(/丢失.*护照|lost.*passport/i)).toBeVisible()
  })

  test('Step 7: 家庭信息 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-7')
    
    // 父母信息（使用更精确的标题定位）
    await expect(page.locator('text=/父亲信息|Father.*Information/i')).toBeVisible()
    await expect(page.locator('text=/母亲信息|Mother.*Information/i')).toBeVisible()
    await expect(page.getByLabel(/直系亲属.*美国|immediate relatives.*US/i)).toBeVisible()
  })

  test('Step 8: 工作教育 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-8')
    
    // 职业信息
    await expect(page.getByLabel(/当前职业|Primary Occupation/i)).toBeVisible()
    await expect(page.getByLabel(/教育程度|Education/i)).toBeVisible()
  })

  test('Step 8: 职业联动逻辑', async ({ page }) => {
    await page.goto('/form/step-8')
    
    // 选择"在职"
    const occupationSelect = page.getByLabel(/当前职业|Primary Occupation/i)
    await occupationSelect.selectOption('Employed')
    await page.waitForTimeout(300)
    
    // 应该显示雇主信息
    await expect(page.getByLabel(/雇主.*名称|Employer/i)).toBeVisible({ timeout: 3000 })
  })

  test('Step 9: 安全问题 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-9')
    
    // 安全问题（7个复选框）
    await expect(page.getByLabel(/传染病|communicable disease/i)).toBeVisible()
    await expect(page.getByLabel(/精神疾病|mental disorder/i)).toBeVisible()
    await expect(page.getByLabel(/滥用药物|drug abuser/i)).toBeVisible()
    await expect(page.getByLabel(/被逮捕|arrested/i)).toBeVisible()
    await expect(page.getByLabel(/违反.*法律|violated.*law/i)).toBeVisible()
    await expect(page.getByLabel(/卖淫|prostitution/i)).toBeVisible()
    await expect(page.getByLabel(/恐怖|terrorism/i)).toBeVisible()
  })

  test('Step 10: 照片上传 - 基础功能', async ({ page }) => {
    await page.goto('/form/step-10')
    
    // 照片上传区域
    await expect(page.locator('text=/上传照片|Upload Photo/i')).toBeVisible()
    await expect(page.locator('text=/照片要求|Photo Requirements/i')).toBeVisible()
  })

  test('Step 11: 附加信息 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-11')
    
    // 附加信息输入框
    await expect(page.getByLabel(/补充说明|Additional Information/i)).toBeVisible()
  })

  test('Step 12: 审核提交 - 基础字段', async ({ page }) => {
    await page.goto('/form/step-12')
    
    // 确认复选框
    await expect(page.getByLabel(/证明.*真实|certify.*true/i)).toBeVisible()
    await expect(page.getByLabel(/同意.*条款|agree.*terms/i)).toBeVisible()
    
    // 提交按钮
    await expect(page.getByRole('button', { name: /提交申请|Submit/i })).toBeVisible()
  })

  test('导航栏显示所有步骤', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 检查导航栏是否存在（可能包含"Step 1"或"第 1 步"）
    const nav = page.locator('nav, [role="navigation"]').first()
    await expect(nav).toBeVisible({ timeout: 5000 })
  })

  test('表单自动保存提示', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 检查自动保存提示
    await expect(page.locator('text=/自动保存|automatically saved/i')).toBeVisible()
  })

  test('Step 1-2 完整填写流程', async ({ page }) => {
    // Step 1: 填写个人信息
    await page.goto('/form/step-1')
    
    // 使用 placeholder 精确定位
    await page.locator('input[placeholder="WANG"]').fill('ZHANG')
    await page.locator('input[placeholder="MING"]').fill('SAN')
    await page.getByLabel(/出生日期|Date of Birth/i).fill('1990-01-01')
    await page.getByLabel(/出生城市|City of Birth/i).fill('Beijing')
    await page.getByLabel(/出生国家|Country.*Birth/i).selectOption('China')
    await page.getByLabel(/国籍|Nationality/i).selectOption('China')
    
    // 点击"下一步"
    const step1NextButton = page.getByRole('button', { name: /下一步|Next|Continue/i })
    await step1NextButton.click()
    
    // 应该跳转到 Step 2
    await page.waitForURL(/\/form\/step-2/, { timeout: 5000 })
    
    // Step 2: 填写旅行信息
    await page.getByLabel(/旅行目的|Purpose of Trip/i).selectOption('Tourism')
    await page.getByLabel(/计划到达日期|Intended.*Arrival/i).fill('2026-06-01')
    await page.getByLabel(/计划停留时长|Length of Stay/i).fill('14')
    
    // 检查是否成功填写
    const arrivalDateValue = await page.getByLabel(/计划到达日期|Intended.*Arrival/i).inputValue()
    expect(arrivalDateValue).toBe('2026-06-01')
  })
})
