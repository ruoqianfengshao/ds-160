#!/usr/bin/env node
/**
 * Debug script to investigate auth flow
 */

import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = `debug${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test123456';

async function debug() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  // Monitor network requests
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('\n=== Navigating to signup page ===');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('\n=== Filling form ===');
    await page.fill('input[type="text"]', 'Debug User');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    console.log('\n=== Submitting form ===');
    console.log('Current URL:', page.url());
    
    // Click and wait for response
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/signup')),
      page.click('button[type="submit"]')
    ]);
    
    console.log('\n=== Signup response received ===');
    console.log('Status:', response.status());
    const body = await response.json();
    console.log('Body:', JSON.stringify(body, null, 2));
    
    // Check cookies immediately after response
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    console.log('\nAuth cookie:', authCookie ? 'Found' : 'NOT FOUND');
    if (authCookie) {
      console.log('Cookie value:', authCookie.value.substring(0, 30) + '...');
    }
    
    // Wait a bit and check URL
    console.log('\n=== Waiting for navigation ===');
    await page.waitForTimeout(3000);
    console.log('URL after 3s:', page.url());
    
    // Check if still on signup page
    const currentUrl = page.url();
    if (currentUrl.includes('/signup')) {
      console.log('\n⚠️  STILL ON SIGNUP PAGE - Navigation did not happen!');
      
      // Check for error messages
      const errorMsg = await page.locator('.text-red-800').textContent().catch(() => null);
      if (errorMsg) {
        console.log('Error message:', errorMsg);
      }
      
      // Check button state
      const buttonText = await page.locator('button[type="submit"]').textContent();
      console.log('Button text:', buttonText);
    } else if (currentUrl.includes('/dashboard')) {
      console.log('\n✅ Successfully navigated to dashboard');
    } else {
      console.log('\n❓ Navigated to unexpected page:', currentUrl);
    }
    
    // Keep browser open for manual inspection
    console.log('\n=== Keeping browser open for 30s for inspection ===');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

debug();
