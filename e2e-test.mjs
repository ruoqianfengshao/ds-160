#!/usr/bin/env node

/**
 * DS-160 Helper - End-to-End Test Suite
 * 
 * Tests the complete user journey from registration to form filling
 * Uses Playwright for browser automation
 */

import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';

// Default to localhost for better reliability; override with BASE_URL env var
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = `e2etest${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test123456';
const SCREENSHOTS_DIR = './test-screenshots';

// Health check configuration
const HEALTH_CHECK_MAX_RETRIES = 5;
const HEALTH_CHECK_RETRY_DELAY = 10000; // 10 seconds

// Ensure screenshots directory exists
try {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
} catch (e) {}

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
}

function logTest(testId, name, status, error = null) {
  const result = { testId, name, status, error, timestamp: new Date().toISOString() };
  results.tests.push(result);
  
  if (status === 'PASS') {
    results.passed++;
    log(`✅ ${testId}: ${name}`, 'PASS');
  } else if (status === 'FAIL') {
    results.failed++;
    log(`❌ ${testId}: ${name} - ${error}`, 'FAIL');
  } else {
    results.skipped++;
    log(`⏭️  ${testId}: ${name}`, 'SKIP');
  }
}

/**
 * Health check function to verify the application is accessible
 * Retries multiple times with delays to handle cold starts
 */
async function healthCheck(url, maxRetries = HEALTH_CHECK_MAX_RETRIES) {
  log(`Starting health check for ${url}...`);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      log(`Health check attempt ${i + 1}/${maxRetries}...`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'DS-160-E2E-Test/1.0' },
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      if (response.ok || response.status === 304) {
        log(`✅ Health check passed! Status: ${response.status}`, 'SUCCESS');
        return true;
      }
      
      log(`Health check returned status ${response.status}`, 'WARN');
      
    } catch (error) {
      log(`Health check failed: ${error.message}`, 'WARN');
      
      if (i < maxRetries - 1) {
        log(`Waiting ${HEALTH_CHECK_RETRY_DELAY / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, HEALTH_CHECK_RETRY_DELAY));
      }
    }
  }
  
  throw new Error(`Application not responding after ${maxRetries} health check attempts`);
}

async function takeScreenshot(page, name) {
  try {
    const filename = `${SCREENSHOTS_DIR}/${name}-${Date.now()}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    log(`Screenshot saved: ${filename}`);
    return filename;
  } catch (e) {
    log(`Failed to take screenshot: ${e.message}`, 'WARN');
  }
}

async function test001_UserRegistration(browser) {
  const testId = 'E2E-001';
  const testName = 'User Registration';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to signup page
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check if page loaded
    const title = await page.title();
    log(`Page title: ${title}`);
    
    // Fill registration form
    await page.fill('input[type="text"]', 'E2E Test User');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    log(`Submitting registration with email: ${TEST_EMAIL}`);
    
    // Click submit and wait for URL change
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Verify we're on dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected redirect to /dashboard, got ${currentUrl}`);
    }
    
    // Verify auth token cookie
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    if (!authCookie) {
      throw new Error('auth_token cookie not found');
    }
    
    log(`Successfully registered and logged in. Cookie: ${authCookie.value.substring(0, 20)}...`);
    
    await takeScreenshot(page, 'test001-success');
    logTest(testId, testName, 'PASS');
    
    await context.close();
    return true;
    
  } catch (error) {
    await takeScreenshot(page, 'test001-failure');
    logTest(testId, testName, 'FAIL', error.message);
    await context.close();
    return false;
  }
}

async function test002_UserLogin(browser) {
  const testId = 'E2E-002';
  const testName = 'User Login';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Fill login form
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    log(`Logging in with email: ${TEST_EMAIL}`);
    
    // Submit and wait for URL change
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Verify we're on dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected redirect to /dashboard, got ${currentUrl}`);
    }
    
    // Verify user info displayed
    const content = await page.content();
    if (!content.includes(TEST_EMAIL)) {
      throw new Error('User email not found on dashboard');
    }
    
    await takeScreenshot(page, 'test002-success');
    logTest(testId, testName, 'PASS');
    
    await context.close();
    return true;
    
  } catch (error) {
    await takeScreenshot(page, 'test002-failure');
    logTest(testId, testName, 'FAIL', error.message);
    await context.close();
    return false;
  }
}

async function test003_DashboardAccess(browser) {
  const testId = 'E2E-003';
  const testName = 'Dashboard Access';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Check dashboard elements
    await page.waitForSelector('text=Dashboard', { timeout: 5000 });
    
    // Verify page elements
    const hasProgress = await page.locator('text=Progress').count() > 0;
    const hasDrafts = await page.locator('text=Draft').count() > 0;
    
    if (!hasProgress && !hasDrafts) {
      throw new Error('Dashboard elements not found');
    }
    
    await takeScreenshot(page, 'test003-success');
    logTest(testId, testName, 'PASS');
    
    await context.close();
    return true;
    
  } catch (error) {
    await takeScreenshot(page, 'test003-failure');
    logTest(testId, testName, 'FAIL', error.message);
    await context.close();
    return false;
  }
}

async function test008_UnauthorizedAccess(browser) {
  const testId = 'E2E-008';
  const testName = 'Unauthorized Access Control';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Try to access dashboard without login
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Should redirect to login
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      throw new Error(`Expected redirect to /login, got ${currentUrl}`);
    }
    
    log('Correctly redirected unauthenticated user to login');
    
    await takeScreenshot(page, 'test008-success');
    logTest(testId, testName, 'PASS');
    
    await context.close();
    return true;
    
  } catch (error) {
    await takeScreenshot(page, 'test008-failure');
    logTest(testId, testName, 'FAIL', error.message);
    await context.close();
    return false;
  }
}

async function test009_FormValidation(browser) {
  const testId = 'E2E-009';
  const testName = 'Form Validation';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/signup`);
    await page.waitForTimeout(2000);
    
    // Test 1: Empty email
    await page.fill('input[type="email"]', '');
    await page.fill('input[type="password"]', 'Test123456');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Browser should prevent submission (HTML5 validation)
    const url1 = page.url();
    if (url1.includes('/dashboard')) {
      throw new Error('Form submitted with empty email');
    }
    
    // Test 2: Invalid email format
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const url2 = page.url();
    if (url2.includes('/dashboard')) {
      throw new Error('Form submitted with invalid email');
    }
    
    // Test 3: Short password
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Should show error or stay on page
    const content = await page.content();
    const hasError = content.includes('at least 6') || !page.url().includes('/dashboard');
    
    if (!hasError) {
      throw new Error('Short password not rejected');
    }
    
    log('All validation rules working correctly');
    
    await takeScreenshot(page, 'test009-success');
    logTest(testId, testName, 'PASS');
    
    await context.close();
    return true;
    
  } catch (error) {
    await takeScreenshot(page, 'test009-failure');
    logTest(testId, testName, 'FAIL', error.message);
    await context.close();
    return false;
  }
}

async function runAllTests() {
  log('='.repeat(60));
  log('DS-160 Helper - End-to-End Test Suite');
  log('='.repeat(60));
  log(`Base URL: ${BASE_URL}`);
  log(`Test Email: ${TEST_EMAIL}`);
  log('='.repeat(60));
  
  // Perform health check before starting tests
  try {
    await healthCheck(BASE_URL);
  } catch (error) {
    log('❌ Health check failed! Aborting test suite.', 'ERROR');
    log(error.message, 'ERROR');
    
    // Mark all tests as skipped
    ['E2E-001', 'E2E-002', 'E2E-003', 'E2E-008', 'E2E-009'].forEach((testId, index) => {
      const testNames = [
        'User Registration',
        'User Login',
        'Dashboard Access',
        'Unauthorized Access Control',
        'Form Validation'
      ];
      logTest(testId, testNames[index], 'FAIL', `Health check failed: ${error.message}`);
    });
    
    // Write results and exit
    const reportPath = './e2e-test-results.json';
    writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`Test results saved to: ${reportPath}`);
    process.exit(1);
  }
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Run tests in sequence
    await test001_UserRegistration(browser);
    await test002_UserLogin(browser);
    await test003_DashboardAccess(browser);
    await test008_UnauthorizedAccess(browser);
    await test009_FormValidation(browser);
    
  } finally {
    await browser.close();
  }
  
  // Print summary
  log('='.repeat(60));
  log('TEST SUMMARY');
  log('='.repeat(60));
  log(`Total: ${results.passed + results.failed + results.skipped}`);
  log(`✅ Passed: ${results.passed}`);
  log(`❌ Failed: ${results.failed}`);
  log(`⏭️  Skipped: ${results.skipped}`);
  log('='.repeat(60));
  
  // Write detailed results to file
  const reportPath = './e2e-test-results.json';
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`Detailed results saved to: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'ERROR');
  console.error(error);
  process.exit(1);
});
