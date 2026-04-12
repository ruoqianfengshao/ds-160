#!/usr/bin/env node

/**
 * DS-160 Helper - API End-to-End Test Suite
 * Tests backend APIs without browser automation
 */

const BASE_URL = 'https://ds-160-ten.vercel.app';
const TEST_EMAIL = `e2etest${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test123456';

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, level = 'INFO') {
  const colors = {
    INFO: '\x1b[36m',
    PASS: '\x1b[32m',
    FAIL: '\x1b[31m',
    WARN: '\x1b[33m',
    RESET: '\x1b[0m'
  };
  console.log(`${colors[level] || ''}${message}${colors.RESET}`);
}

function logTest(testId, name, status, error = null) {
  results.tests.push({ testId, name, status, error });
  
  if (status === 'PASS') {
    results.passed++;
    log(`✅ ${testId}: ${name}`, 'PASS');
  } else {
    results.failed++;
    log(`❌ ${testId}: ${name} - ${error}`, 'FAIL');
  }
}

// Helper to extract cookies from response
function getCookies(response) {
  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) return {};
  
  const cookies = {};
  setCookie.split(',').forEach(cookie => {
    const [nameValue] = cookie.split(';');
    const [name, value] = nameValue.split('=');
    if (name && value) {
      cookies[name.trim()] = value.trim();
    }
  });
  return cookies;
}

async function test001_UserRegistration() {
  const testId = 'E2E-001';
  const testName = 'API: User Registration';
  
  log(`\nStarting ${testId}: ${testName}`, 'INFO');
  log(`Test email: ${TEST_EMAIL}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        fullName: 'E2E Test User'
      })
    });
    
    const status = response.status;
    log(`Response status: ${status}`);
    
    if (status !== 200 && status !== 201) {
      const error = await response.text();
      throw new Error(`Expected 200/201, got ${status}: ${error}`);
    }
    
    const data = await response.json();
    log(`Response: ${JSON.stringify(data, null, 2)}`);
    
    if (!data.success) {
      throw new Error('Registration did not return success=true');
    }
    
    if (!data.user || !data.user.id) {
      throw new Error('User object missing in response');
    }
    
    // Check for auth cookie
    const cookies = getCookies(response);
    if (!cookies.auth_token && !response.headers.get('set-cookie')?.includes('auth_token')) {
      log('Warning: auth_token cookie not found in response', 'WARN');
    }
    
    log(`User created: ${data.user.email} (ID: ${data.user.id})`);
    logTest(testId, testName, 'PASS');
    return data.user;
    
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return null;
  }
}

async function test002_UserLogin() {
  const testId = 'E2E-002';
  const testName = 'API: User Login';
  
  log(`\nStarting ${testId}: ${testName}`, 'INFO');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });
    
    const status = response.status;
    log(`Response status: ${status}`);
    
    if (status !== 200) {
      const error = await response.text();
      throw new Error(`Expected 200, got ${status}: ${error}`);
    }
    
    const data = await response.json();
    log(`Response: ${JSON.stringify(data, null, 2)}`);
    
    if (!data.success) {
      throw new Error('Login did not return success=true');
    }
    
    if (!data.user || !data.user.email) {
      throw new Error('User object missing in response');
    }
    
    if (data.user.email !== TEST_EMAIL) {
      throw new Error(`Expected email ${TEST_EMAIL}, got ${data.user.email}`);
    }
    
    // Extract auth token
    const cookies = response.headers.get('set-cookie');
    let authToken = null;
    if (cookies) {
      const match = cookies.match(/auth_token=([^;]+)/);
      if (match) {
        authToken = match[1];
        log(`Auth token: ${authToken.substring(0, 20)}...`);
      }
    }
    
    logTest(testId, testName, 'PASS');
    return { user: data.user, authToken };
    
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return null;
  }
}

async function test003_GetCurrentUser(authToken) {
  const testId = 'E2E-003';
  const testName = 'API: Get Current User';
  
  log(`\nStarting ${testId}: ${testName}`, 'INFO');
  
  if (!authToken) {
    logTest(testId, testName, 'FAIL', 'No auth token provided');
    return null;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/user/me`, {
      headers: {
        'Cookie': `auth_token=${authToken}`
      }
    });
    
    const status = response.status;
    log(`Response status: ${status}`);
    
    if (status !== 200) {
      const error = await response.text();
      throw new Error(`Expected 200, got ${status}: ${error}`);
    }
    
    const data = await response.json();
    log(`Response: ${JSON.stringify(data, null, 2)}`);
    
    if (!data.user) {
      throw new Error('User object missing in response');
    }
    
    if (data.user.email !== TEST_EMAIL) {
      throw new Error(`Expected email ${TEST_EMAIL}, got ${data.user.email}`);
    }
    
    logTest(testId, testName, 'PASS');
    return data.user;
    
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return null;
  }
}

async function test004_UnauthorizedAccess() {
  const testId = 'E2E-004';
  const testName = 'API: Unauthorized Access';
  
  log(`\nStarting ${testId}: ${testName}`, 'INFO');
  
  try {
    const response = await fetch(`${BASE_URL}/api/user/me`);
    
    const status = response.status;
    log(`Response status: ${status}`);
    
    if (status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${status}`);
    }
    
    log('Correctly rejected unauthorized request');
    logTest(testId, testName, 'PASS');
    return true;
    
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return false;
  }
}

async function test005_DuplicateRegistration() {
  const testId = 'E2E-005';
  const testName = 'API: Duplicate Email Registration';
  
  log(`\nStarting ${testId}: ${testName}`, 'INFO');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        fullName: 'Duplicate Test'
      })
    });
    
    const status = response.status;
    log(`Response status: ${status}`);
    
    if (status === 200 || status === 201) {
      throw new Error('Should not allow duplicate email registration');
    }
    
    if (status !== 409 && status !== 400) {
      log(`Warning: Expected 409 Conflict or 400, got ${status}`, 'WARN');
    }
    
    const data = await response.json();
    log(`Response: ${JSON.stringify(data, null, 2)}`);
    
    if (!data.message || !data.message.toLowerCase().includes('exist')) {
      log('Warning: Error message does not mention existing email', 'WARN');
    }
    
    log('Correctly rejected duplicate email');
    logTest(testId, testName, 'PASS');
    return true;
    
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return false;
  }
}

async function test006_InvalidLogin() {
  const testId = 'E2E-006';
  const testName = 'API: Invalid Login Credentials';
  
  log(`\nStarting ${testId}: ${testName}`, 'INFO');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: 'WrongPassword123'
      })
    });
    
    const status = response.status;
    log(`Response status: ${status}`);
    
    if (status === 200) {
      throw new Error('Should not allow login with wrong password');
    }
    
    if (status !== 401) {
      log(`Warning: Expected 401 Unauthorized, got ${status}`, 'WARN');
    }
    
    log('Correctly rejected invalid credentials');
    logTest(testId, testName, 'PASS');
    return true;
    
  } catch (error) {
    logTest(testId, testName, 'FAIL', error.message);
    return false;
  }
}

async function runAllTests() {
  log('='.repeat(70));
  log('DS-160 Helper - API End-to-End Test Suite', 'INFO');
  log('='.repeat(70));
  log(`Base URL: ${BASE_URL}`, 'INFO');
  log(`Test Email: ${TEST_EMAIL}`, 'INFO');
  log('='.repeat(70));
  
  let authToken = null;
  
  // Run tests sequentially
  const user = await test001_UserRegistration();
  
  if (user) {
    const loginResult = await test002_UserLogin();
    if (loginResult) {
      authToken = loginResult.authToken;
      await test003_GetCurrentUser(authToken);
    }
  }
  
  await test004_UnauthorizedAccess();
  await test005_DuplicateRegistration();
  await test006_InvalidLogin();
  
  // Print summary
  log('\n' + '='.repeat(70));
  log('TEST SUMMARY', 'INFO');
  log('='.repeat(70));
  log(`Total: ${results.passed + results.failed}`, 'INFO');
  log(`✅ Passed: ${results.passed}`, 'PASS');
  log(`❌ Failed: ${results.failed}`, results.failed > 0 ? 'FAIL' : 'INFO');
  log('='.repeat(70));
  
  if (results.failed > 0) {
    log('\nFailed Tests:', 'FAIL');
    results.tests.filter(t => t.status === 'FAIL').forEach(t => {
      log(`  ${t.testId}: ${t.name}`, 'FAIL');
      log(`    Error: ${t.error}`, 'FAIL');
    });
  }
  
  log(`\nTest completed with email: ${TEST_EMAIL}`);
  log('You can use this account for manual testing in browser');
  log(`Password: ${TEST_PASSWORD}\n`);
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'FAIL');
  console.error(error);
  process.exit(1);
});
