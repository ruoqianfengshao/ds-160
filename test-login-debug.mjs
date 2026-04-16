#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = `debugtest${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test123!@#';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[BROWSER ERROR] ${err.message}`));
  
  console.log('=== STEP 1: Register ===');
  await page.goto(`${BASE_URL}/signup`);
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  console.log('Clicking submit...');
  
  // Listen for network requests
  page.on('response', async (response) => {
    if (response.url().includes('/api/auth/')) {
      console.log(`[API] ${response.request().method()} ${response.url()} → ${response.status()}`);
      if (response.status() === 200) {
        try {
          const body = await response.json();
          console.log(`[API Response]`, JSON.stringify(body, null, 2));
        } catch (e) {
          // Not JSON
        }
      }
    }
  });
  
  await page.click('button[type="submit"]');
  console.log('Waiting for navigation...');
  
  // Wait 5 seconds to see what happens
  await page.waitForTimeout(5000);
  
  console.log(`Current URL: ${page.url()}`);
  const cookies = await context.cookies();
  console.log('Cookies:', cookies.map(c => ({ name: c.name, value: c.value.substring(0, 30) })));
  
  // Check if we're on dashboard
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  const dashboardVisible = await page.locator('text=Dashboard').count();
  console.log(`Dashboard visible: ${dashboardVisible > 0}`);
  
  await context.close();
  await browser.close();
}

main().catch(console.error);
