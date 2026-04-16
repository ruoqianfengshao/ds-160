#!/usr/bin/env node

const testEmail = `manual-test-${Date.now()}@example.com`;
const testPassword = 'Test123456';

console.log('Testing registration with:', testEmail);

// Test registration
const signupResp = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: testEmail, password: testPassword })
});

const signupData = await signupResp.json();
console.log('Signup response:', signupData);

// Get cookie
const cookie = signupResp.headers.get('set-cookie');
console.log('Cookie:', cookie);

if (!cookie) {
  console.error('No cookie set!');
  process.exit(1);
}

// Test /api/user/me with cookie
console.log('\nTesting /api/user/me with cookie...');
const meResp = await fetch('http://localhost:3000/api/user/me', {
  headers: { Cookie: cookie }
});

console.log('Status:', meResp.status);
const meData = await meResp.json();
console.log('User data:', meData);

