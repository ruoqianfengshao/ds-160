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
      log(`Health check failed: ${error.message}`, 'ERROR');
    }
    
    // If not the last retry, wait before trying again
    if (i < maxRetries - 1) {
      log(`Waiting ${HEALTH_CHECK_RETRY_DELAY / 1000}s before next attempt...`, 'INFO');
      await new Promise(resolve => setTimeout(resolve, HEALTH_CHECK_RETRY_DELAY));
    }
  }
  
  log(`❌ Health check failed after ${maxRetries} attempts`, 'ERROR');
  return false;
}

async function takeScreenshot(page, name) {
  const filename = `${SCREENSHOTS_DIR}/${name}-${Date.now()}.png`;
  try {
    await page.screenshot({ path: filename, fullPage: true });
    log(`Screenshot saved: ${filename}`);
  } catch (e) {
    log(`Failed to save screenshot: ${e.message}`, 'ERROR');
  }
}

/**
 * Test E2E-001: User Registration
 */
async function testUserRegistration(browser) {
  const testId = 'E2E-001';
  const testName = 'User Registration';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to signup page and wait for client-side hydration
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Extra wait for Vue hydration
    
    // Check if page loaded
    const title = await page.title();
    log(`Page title: ${title}`);
    
    // Fill registration form
    await page.fill('input[type="text"]', 'E2E Test User');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    log(`Submitting registration with email: ${TEST_EMAIL}`);
    
    // Click submit button (triggers async auth flow)
    await page.click('button[type="submit"]');
    
    // Wait for async navigation to complete (API call + store update + navigateTo)
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    log(`Successfully navigated to dashboard`)
    
    // Verify dashboard loaded with auth content
    const hasDashboard = await page.locator('text=Dashboard').count() > 0;
    if (!hasDashboard) {
      throw new Error('Dashboard title not found');
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

/**
 * Test E2E-002: User Login
 */
async function testUserLogin(browser) {
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
    
    log(`Submitting login with email: ${TEST_EMAIL}`);
    
    // Click submit button (triggers async auth flow)
    await page.click('button[type="submit"]');
    
    // Wait for async navigation to complete
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Verify dashboard loaded
    const hasDashboard = await page.locator('text=Dashboard').count() > 0;
    if (!hasDashboard) {
      throw new Error('Dashboard title not found');
    }
    
    // Verify auth token
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    if (!authCookie) {
      throw new Error('auth_token cookie not found after login');
    }
    
    log(`Successfully logged in. Cookie: ${authCookie.value.substring(0, 20)}...`);
    
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

/**
 * Test E2E-003: Dashboard Access After Login
 */
async function testDashboardAccess(browser) {
  const testId = 'E2E-003';
  const testName = 'Dashboard Access';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // First login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    log(`Logging in with email: ${TEST_EMAIL}`);
    
    // Click submit and wait for async navigation
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Now test direct dashboard access
    log(`Navigating directly to dashboard...`);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Verify we stay on dashboard (not redirected to login)
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected to stay on /dashboard, but got ${currentUrl}`);
    }
    
    // Verify dashboard content
    const hasDashboard = await page.locator('text=Dashboard').count() > 0;
    if (!hasDashboard) {
      throw new Error('Dashboard title not found');
    }
    
    log(`Successfully accessed dashboard with authenticated session`);
    
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

/**
 * Test E2E-008: Unauthenticated Dashboard Access (Freemium Model)
 */
async function testUnauthenticatedDashboardAccess(browser) {
  const testId = 'E2E-008';
  const testName = 'Unauthenticated Dashboard Access (Freemium Model)';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Try to access dashboard without auth
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // In freemium mode, should stay on dashboard (not redirect to login)
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected freemium access to /dashboard, but got redirected to ${currentUrl}`);
    }
    
    log(`Freemium dashboard access allowed (as expected)`);
    
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

/**
 * Test E2E-009: Form Validation
 */
async function testFormValidation(browser) {
  const testId = 'E2E-009';
  const testName = 'Form Validation';
  
  log(`Starting ${testId}: ${testName}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test signup form validation
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Try to submit without filling fields
    log(`Testing empty form submission...`);
    await page.click('button[type="submit"]');
    
    // Should show HTML5 validation or stay on page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (!currentUrl.includes('/signup')) {
      throw new Error(`Form validation failed: unexpectedly navigated away from signup`);
    }
    
    log(`Empty form validation passed (stayed on signup page)`);
    
    // Test invalid email format
    log(`Testing invalid email format...`);
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'short');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Should still be on signup
    const stillOnSignup = page.url().includes('/signup');
    if (!stillOnSignup) {
      throw new Error(`Email validation failed: form submitted with invalid data`);
    }
    
    log(`Invalid email validation passed`);
    
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

/**
 * Main test runner
 */
async function runTests() {
  const startTime = Date.now();
  
  log('='.repeat(60));
  log('DS-160 Helper - E2E Test Suite');
  log('='.repeat(60));
  log(`Base URL: ${BASE_URL}`);
  log(`Test Email: ${TEST_EMAIL}`);
  log('='.repeat(60));
  
  // Run health check first
  const isHealthy = await healthCheck(BASE_URL);
  if (!isHealthy) {
    log('❌ Application is not accessible. Aborting tests.', 'ERROR');
    process.exit(1);
  }
  
  log('Starting test execution...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Run tests sequentially
    await testUserRegistration(browser);
    await testUserLogin(browser);
    await testDashboardAccess(browser);
    await testUnauthenticatedDashboardAccess(browser);
    await testFormValidation(browser);
    
    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    results.duration = `${duration}s`;
    results.baseUrl = BASE_URL;
    results.testEmail = TEST_EMAIL;
    results.timestamp = new Date().toISOString();
    
    // Save results
    writeFileSync('e2e-test-results.json', JSON.stringify(results, null, 2));
    
    // Print summary
    log('='.repeat(60));
    log('Test Summary');
    log('='.repeat(60));
    log(`Passed: ${results.passed}`);
    log(`Failed: ${results.failed}`);
    log(`Skipped: ${results.skipped}`);
    log(`Duration: ${duration}s`);
    log('='.repeat(60));
    
    if (results.failed > 0) {
      log('❌ Some tests failed. Check e2e-test-results.json for details.', 'ERROR');
      process.exit(1);
    } else {
      log('✅ All tests passed!', 'SUCCESS');
      process.exit(0);
    }
    
  } catch (error) {
    log(`Fatal error during test execution: ${error.message}`, 'ERROR');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests
runTests().catch(error => {
  log(`Unhandled error: ${error.message}`, 'ERROR');
  process.exit(1);
});
