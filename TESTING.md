# Testing Guide

## 🧪 Testing Strategy

DS-160 Helper uses a multi-layered testing approach:

1. **API Tests** - Backend endpoint testing (fast, no browser)
2. **E2E Tests** - Full browser automation with Playwright
3. **Manual Tests** - Comprehensive checklist for human verification

---

## 🚀 Quick Start

### Run API Tests (Recommended)

```bash
npm test
# or
npm run test:api
```

**What it tests:**
- User registration
- User login  
- Current user endpoint
- Unauthorized access handling
- Duplicate email validation
- Invalid credentials rejection

**Duration:** ~10 seconds

---

### Run E2E Tests (Full Browser)

```bash
npm run test:e2e
```

**What it tests:**
- Complete user registration flow
- Login and logout
- Dashboard access
- Form validation
- Authorization middleware
- Page navigation

**Duration:** ~2 minutes  
**Requirements:** Playwright browsers installed

---

## 🤖 Automated Testing (GitHub Actions)

Tests run automatically on:
- Every push to `main` branch
- Every pull request
- Manual trigger via GitHub Actions UI

### View Test Results

1. Go to: https://github.com/ruoqianfengshao/ds-160/actions
2. Click on the latest workflow run
3. Check the test results
4. Download artifacts (screenshots, logs) if needed

### Workflows

- **API Tests** (`.github/workflows/api-tests.yml`)
  - Fast API endpoint tests
  - No browser required
  - Runs in ~1 minute

- **E2E Tests** (`.github/workflows/e2e-tests.yml`)
  - Full browser automation
  - Screenshots on failure
  - Runs in ~3 minutes

---

## 📋 Manual Testing

When automated tests aren't sufficient, follow the manual testing guide:

**Guide:** `MANUAL_E2E_TEST.md`

**Key test scenarios:**
1. User registration
2. Login/logout
3. Dashboard functionality
4. Data persistence (critical!)
5. Form validation
6. Authorization

---

## 🐛 Troubleshooting

### API Tests Fail

**Check:**
1. Is the app deployed? https://ds-160-ten.vercel.app
2. Are database migrations applied?
3. Are environment variables set?

**Debug:**
```bash
node e2e-api-test.mjs 2>&1 | tee test-output.log
```

### E2E Tests Timeout

**Check:**
1. Network connectivity
2. Page load time (should be <10s)
3. JavaScript errors in browser console

**Debug:**
- Check `test-screenshots/` folder
- Review `e2e-test-results.json`

### Playwright Installation Issues

**Install browsers:**
```bash
npx playwright install chromium --with-deps
```

**Use npm mirror (China):**
```bash
PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright \
  npx playwright install chromium
```

---

## 📊 Test Coverage

| Area | API Tests | E2E Tests | Manual Tests |
|------|-----------|-----------|--------------|
| Authentication | ✅ | ✅ | ✅ |
| Authorization | ✅ | ✅ | ✅ |
| User Registration | ✅ | ✅ | ✅ |
| User Login | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ |
| Form Validation | ❌ | ✅ | ✅ |
| Data Persistence | ❌ | ❌ | ✅ |
| Error Handling | ✅ | ✅ | ✅ |

---

## 🔧 Advanced Usage

### Run Specific Test

Edit `e2e-test.mjs` and comment out unwanted tests:

```javascript
// await test001_UserRegistration(browser);
await test002_UserLogin(browser);
// await test003_DashboardAccess(browser);
```

### Change Test Environment

```bash
BASE_URL=https://your-preview-deployment.vercel.app npm test
```

### Generate Test Data

```bash
# Create test user with specific email
TEST_EMAIL=custom@example.com npm test
```

---

## 📝 Writing New Tests

### API Test Template

```javascript
async function testXXX_YourTest() {
  const testId = 'E2E-XXX';
  const testName = 'Your Test Name';
  
  try {
    const response = await fetch(`${BASE_URL}/api/your-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* data */ })
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    
    const data = await response.json();
    // Add assertions here
    
    logTest(testId, testName, 'PASS');
    return true;
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return false;
  }
}
```

### E2E Test Template

```javascript
async function testXXX_YourTest(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/your-page`);
    // Add interactions here
    
    logTest(testId, testName, 'PASS');
    await context.close();
    return true;
  } catch (error) {
    await takeScreenshot(page, 'testXXX-failure');
    logTest(testId, testName, 'FAIL', error.message);
    await context.close();
    return false;
  }
}
```

---

## 🎯 Test Philosophy

1. **Fast feedback** - API tests run first (10s)
2. **Comprehensive coverage** - E2E tests cover UI flows (2m)
3. **Human verification** - Manual tests for edge cases
4. **Automatic CI** - Tests run on every commit
5. **Visual debugging** - Screenshots on failure

---

## 📚 Documentation

- `E2E_TEST_PLAN.md` - Detailed test plan with 10 test cases
- `MANUAL_E2E_TEST.md` - Step-by-step manual testing guide
- `e2e-test.mjs` - Playwright E2E test implementation
- `e2e-api-test.mjs` - API test implementation

---

## 🆘 Need Help?

**Test failing unexpectedly?**
1. Check GitHub Actions logs
2. Download failure screenshots
3. Review `e2e-test-results.json`
4. Open an issue with logs + screenshots

**Want to add new tests?**
1. Follow the templates above
2. Add to both API and E2E suites
3. Document in `E2E_TEST_PLAN.md`
4. Update this guide
