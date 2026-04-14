import { test, expect } from '@playwright/test'
import applicantData from '../fixtures/realistic-applicant.json' assert { type: 'json' }

/**
 * 真实美签申请端到端测试
 * 
 * 测试场景：
 * 张伟，30岁软件工程师，已婚，计划赴美旅游14天
 * 有美国签证和访问历史，所有安全问题均为否
 */

test.describe('DS-160 真实申请流程', () => {
  test.setTimeout(300000) // 5分钟超时

  test('完整填写并提交 DS-160 表单', async ({ page }) => {
    // Step 0: 访问首页并开始
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('DS-160')
    
    // 点击开始按钮
    const startButton = page.locator('button', { hasText: /开始填写|Start/ }).first()
    await startButton.click()
    
    // 等待页面加载
    await page.waitForLoadState('networkidle')
    
    // ========== Step 1: 个人信息 ==========
    console.log('📝 Step 1: 填写个人信息')
    await expect(page).toHaveURL(/\/form\/step-1/)
    
    // 姓氏
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    
    // 名字
    await page.getByLabel(/名字|Given Names/i).fill(applicantData.applicant.givenNames)
    
    // 完整姓名（本国文字）
    await page.getByLabel(/本国文字|Native Alphabet/i).fill(applicantData.applicant.fullNameInNativeAlphabet)
    
    // 性别
    await page.locator(`input[type="radio"][value="${applicantData.applicant.gender}"]`).first().check()
    
    // 婚姻状况
    await page.locator('select').first().selectOption(applicantData.applicant.maritalStatus)
    
    // 出生日期
    const [year, month, day] = applicantData.applicant.dateOfBirth.split('-')
    await page.getByLabel(/出生日期|Date of Birth/i).fill(`${month}/${day}/${year}`)
    
    // 出生城市
    await page.getByLabel(/出生城市|City of Birth/i).fill(applicantData.applicant.cityOfBirth)
    
    // 出生国家
    await page.getByLabel(/出生国家|Country of Birth/i).fill(applicantData.applicant.countryOfBirth)
    
    // 国籍
    await page.getByLabel(/国籍|Nationality/i).fill(applicantData.applicant.nationality)
    
    // 下一步
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 2: 护照信息 ==========
    console.log('📝 Step 2: 填写护照信息')
    await expect(page).toHaveURL(/\/form\/step-2/)
    
    await page.getByLabel(/护照号码|Passport Number/i).fill(applicantData.passport.number)
    await page.getByLabel(/签发日期|Issue Date/i).fill(applicantData.passport.issueDate)
    await page.getByLabel(/到期日期|Expiry Date/i).fill(applicantData.passport.expiryDate)
    await page.getByLabel(/签发国家|Issuing Country/i).fill(applicantData.passport.issuingCountry)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 3: 旅行信息 ==========
    console.log('📝 Step 3: 填写旅行信息')
    await expect(page).toHaveURL(/\/form\/step-3/)
    
    await page.locator(`input[type="radio"][value="${applicantData.travel.purposeCode}"]`).first().check()
    await page.getByLabel(/具体目的|Specific Purpose/i).fill(applicantData.travel.specificPurpose)
    await page.getByLabel(/预计到达日期|Intended Arrival/i).fill(applicantData.travel.intendedArrivalDate)
    await page.getByLabel(/停留时间|Length of Stay/i).fill(applicantData.travel.intendedLengthOfStay)
    
    // 美国地址
    await page.getByLabel(/美国地址|Address in US/i).fill(applicantData.travel.addressInUS.street)
    await page.getByLabel(/城市|City/i).fill(applicantData.travel.addressInUS.city)
    await page.getByLabel(/州|State/i).fill(applicantData.travel.addressInUS.state)
    await page.getByLabel(/邮编|ZIP Code/i).fill(applicantData.travel.addressInUS.zipCode)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 4: 旅行同伴 ==========
    console.log('📝 Step 4: 填写旅行同伴')
    await expect(page).toHaveURL(/\/form\/step-4/)
    
    // 是否有同伴
    await page.locator('input[type="radio"][value="Yes"]').first().check()
    
    // 添加配偶
    const companion = applicantData.travel.travelCompanions[0]
    await page.getByLabel(/姓氏|Surname/i).fill(companion.surname)
    await page.getByLabel(/名字|Given Names/i).fill(companion.givenNames)
    await page.locator('select').first().selectOption(companion.relationship)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 5: 之前的美国旅行 ==========
    console.log('📝 Step 5: 填写之前的美国旅行')
    await expect(page).toHaveURL(/\/form\/step-5/)
    
    // 是否访问过美国
    await page.locator('input[type="radio"][value="Yes"]').first().check()
    await page.getByLabel(/上次访问日期|Last Visit Date/i).fill(applicantData.previousUSTravel.lastVisit.date)
    
    // 是否被签发过美国签证
    await page.locator('input[type="radio"][value="Yes"]').nth(1).check()
    await page.getByLabel(/签证号码|Visa Number/i).fill(applicantData.previousUSTravel.lastVisa.visaNumber)
    
    // 是否被拒签
    await page.locator('input[type="radio"][value="No"]').first().check()
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 6: 联系方式 ==========
    console.log('📝 Step 6: 填写联系方式')
    await expect(page).toHaveURL(/\/form\/step-6/)
    
    await page.getByLabel(/家庭地址|Home Address/i).fill(applicantData.contact.homeAddress.street)
    await page.getByLabel(/城市|City/i).fill(applicantData.contact.homeAddress.city)
    await page.getByLabel(/邮编|Postal Code/i).fill(applicantData.contact.homeAddress.postalCode)
    await page.getByLabel(/电话|Phone/i).fill(applicantData.contact.phone.primary)
    await page.getByLabel(/邮箱|Email/i).fill(applicantData.contact.email)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 7: 家庭信息 ==========
    console.log('📝 Step 7: 填写家庭信息')
    await expect(page).toHaveURL(/\/form\/step-7/)
    
    // 父亲信息
    await page.getByLabel(/父亲姓氏|Father.*Surname/i).fill(applicantData.family.father.surname)
    await page.getByLabel(/父亲名字|Father.*Given/i).fill(applicantData.family.father.givenNames)
    await page.getByLabel(/父亲出生日期|Father.*Birth/i).fill(applicantData.family.father.dateOfBirth)
    
    // 母亲信息
    await page.getByLabel(/母亲姓氏|Mother.*Surname/i).fill(applicantData.family.mother.surname)
    await page.getByLabel(/母亲名字|Mother.*Given/i).fill(applicantData.family.mother.givenNames)
    await page.getByLabel(/母亲出生日期|Mother.*Birth/i).fill(applicantData.family.mother.dateOfBirth)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 8: 配偶信息 ==========
    console.log('📝 Step 8: 填写配偶信息')
    await expect(page).toHaveURL(/\/form\/step-8/)
    
    await page.getByLabel(/配偶姓氏|Spouse.*Surname/i).fill(applicantData.family.spouse.surname)
    await page.getByLabel(/配偶名字|Spouse.*Given/i).fill(applicantData.family.spouse.givenNames)
    await page.getByLabel(/配偶出生日期|Spouse.*Birth/i).fill(applicantData.family.spouse.dateOfBirth)
    await page.getByLabel(/配偶国籍|Spouse.*Nationality/i).fill(applicantData.family.spouse.nationality)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 9: 工作/教育 ==========
    console.log('📝 Step 9: 填写工作和教育信息')
    await expect(page).toHaveURL(/\/form\/step-9/)
    
    // 当前职业
    await page.getByLabel(/职业|Occupation/i).fill(applicantData.workEducation.currentOccupation)
    await page.getByLabel(/雇主|Employer/i).fill(applicantData.workEducation.employer.name)
    await page.getByLabel(/雇主地址|Employer Address/i).fill(applicantData.workEducation.employer.address.street)
    await page.getByLabel(/月薪|Salary/i).fill(applicantData.workEducation.employer.monthlySalary.toString())
    
    // 教育
    await page.getByLabel(/学校|School/i).fill(applicantData.workEducation.education.school)
    await page.getByLabel(/专业|Course/i).fill(applicantData.workEducation.education.courseOfStudy)
    
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    await page.waitForLoadState('networkidle')
    
    // ========== Step 10-12: 安全问题 ==========
    console.log('📝 Steps 10-12: 回答安全问题（全部选择 No）')
    
    for (let step = 10; step <= 12; step++) {
      await expect(page).toHaveURL(new RegExp(`/form/step-${step}/`))
      
      // 获取所有 radio 按钮并选择 "No"
      const noRadios = page.locator('input[type="radio"][value="No"]')
      const count = await noRadios.count()
      
      for (let i = 0; i < count; i++) {
        await noRadios.nth(i).check()
      }
      
      await page.locator('button', { hasText: /下一步|Next|提交|Submit/ }).click()
      await page.waitForLoadState('networkidle')
    }
    
    // ========== 验证提交成功 ==========
    console.log('✅ 验证提交成功')
    
    // 应该看到成功页面或确认信息
    await page.waitForTimeout(2000)
    
    // 验证数据已保存到 localStorage
    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem('ds160_form_data')
      return data ? JSON.parse(data) : null
    })
    
    expect(savedData).toBeTruthy()
    expect(savedData.step1?.surname).toBe(applicantData.applicant.surname)
    expect(savedData.step2?.passportNumber).toBe(applicantData.passport.number)
    
    console.log('✅ 测试完成：成功填写并提交完整的 DS-160 表单')
  })

  test('验证自动保存功能', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 填写部分字段
    await page.getByLabel(/姓氏|Surname/i).fill(applicantData.applicant.surname)
    await page.getByLabel(/名字|Given Names/i).fill(applicantData.applicant.givenNames)
    
    // 等待自动保存（假设有防抖）
    await page.waitForTimeout(3000)
    
    // 刷新页面
    await page.reload()
    
    // 验证数据已保存
    const surname = await page.getByLabel(/姓氏|Surname/i).inputValue()
    const givenNames = await page.getByLabel(/名字|Given Names/i).inputValue()
    
    expect(surname).toBe(applicantData.applicant.surname)
    expect(givenNames).toBe(applicantData.applicant.givenNames)
    
    console.log('✅ 自动保存功能正常')
  })

  test('验证表单验证功能', async ({ page }) => {
    await page.goto('/form/step-1')
    
    // 尝试不填写必填字段就提交
    await page.locator('button', { hasText: /下一步|Next/ }).click()
    
    // 应该看到验证错误
    const errorMessages = page.locator('.error, [role="alert"], .text-red-500')
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 })
    
    console.log('✅ 表单验证功能正常')
  })

  test('验证步骤导航功能', async ({ page }) => {
    await page.goto('/form/step-3')
    
    // 应该能看到步骤指示器
    const stepIndicators = page.locator('[data-step], .step-indicator, nav a')
    await expect(stepIndicators.first()).toBeVisible()
    
    // 点击返回按钮
    const backButton = page.locator('button', { hasText: /上一步|Back|返回/ })
    if (await backButton.isVisible()) {
      await backButton.click()
      await expect(page).toHaveURL(/\/form\/step-2/)
    }
    
    console.log('✅ 步骤导航功能正常')
  })
})
