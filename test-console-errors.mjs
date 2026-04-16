#!/usr/bin/env node
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') {
    errors.push(msg.text());
    console.log(`[CONSOLE ERROR] ${msg.text()}`);
  }
});

page.on('pageerror', error => {
  errors.push(error.message);
  console.log(`[PAGE ERROR] ${error.message}`);
});

await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

console.log('\n=== Errors Collected ===');
if (errors.length === 0) {
  console.log('No errors found');
} else {
  errors.forEach((err, i) => console.log(`${i+1}. ${err}`));
}

await browser.close();
