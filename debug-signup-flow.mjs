#!/usr/bin/env node

/**
 * Debug signup flow - check what happens after form submission
 */

import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = `debugtest${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test123456';

async function debugSignupFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to all console messages
  page.on('console', msg => {
    console.log(`[Browser ${msg.type()}]`, msg.text());
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.error('[Page Error]', error.message);
  });
  
  // Listen to request failures
  page.on('requestfailed', request => {
    console.error('[Request Failed]', request.url(), request.failure().errorText);
  });
  
  // Listen to responses
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/')) {
      console.log(`[API Response] ${response.status()} ${url}`);
      if (url.includes('/api/auth/signup') || url.includes('/api/user/me')) {
        try {
          const body = await response.json();
          console.log('[API Body]', JSON.stringify(body, null, 2));
        } catch (e) {
          console.log('[API Body] Could not parse as JSON');
        }
      }
    }
  });
  
  try {
    console.log('Navigating to signup page...');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('Page loaded. Title:', await page.title());
    console.log('URL:', page.url());
    
    // Fill form
    console.log('Filling form...');
    await page.fill('input[type="text"]', 'Debug Test User');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    console.log('Form filled. Email:', TEST_EMAIL);
    
    // Submit and watch
    console.log('Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait a bit to see what happens
    console.log('Waiting 20 seconds to observe behavior...');
    await page.waitForTimeout(20000);
    
    console.log('Final URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Check cookies
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    console.log('Auth cookie present:', !!authCookie);
    
    // Check if we're on dashboard
    const onDashboard = page.url().includes('/dashboard');
    console.log('On dashboard page:', onDashboard);
    
    if (!onDashboard) {
      console.log('Not on dashboard. Taking screenshot...');
      await page.screenshot({ path: './debug-signup-stuck.png', fullPage: true });
      console.log('Screenshot saved to debug-signup-stuck.png');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: './debug-signup-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

debugSignupFlow().catch(console.error);
