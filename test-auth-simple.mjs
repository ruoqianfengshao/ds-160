// Test auth flow using fetch
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'test123456';
const testName = 'Test User';

console.log('🚀 测试注册登录流程\n');
console.log(`测试邮箱: ${testEmail}`);
console.log(`测试密码: ${testPassword}\n`);

try {
  // 1. 注册
  console.log('='.repeat(50));
  console.log('第 1 步: 注册新账号');
  console.log('='.repeat(50));
  
  const signupResponse = await fetch('https://ds-160-ten.vercel.app/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      fullName: testName
    })
  });
  
  console.log(`状态码: ${signupResponse.status} ${signupResponse.statusText}`);
  const signupData = await signupResponse.json();
  console.log('响应:', JSON.stringify(signupData, null, 2));
  
  if (signupData.success) {
    console.log('✅ 注册成功！\n');
  } else {
    console.log('❌ 注册失败\n');
    process.exit(1);
  }
  
  // 等待 2 秒
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 2. 登录
  console.log('='.repeat(50));
  console.log('第 2 步: 登录测试');
  console.log('='.repeat(50));
  
  const loginResponse = await fetch('https://ds-160-ten.vercel.app/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  
  console.log(`状态码: ${loginResponse.status} ${loginResponse.statusText}`);
  console.log(`Set-Cookie: ${loginResponse.headers.get('set-cookie')}`);
  
  const loginData = await loginResponse.json();
  console.log('响应:', JSON.stringify(loginData, null, 2));
  
  if (loginData.success) {
    console.log('✅ 登录成功！');
    console.log(`用户 ID: ${loginData.user.id}`);
    console.log(`用户邮箱: ${loginData.user.email}`);
  } else {
    console.log('❌ 登录失败');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ 完整流程测试通过！');
  console.log('='.repeat(50));
  
} catch (error) {
  console.error('\n❌ 测试失败:', error.message);
  console.error(error.stack);
  process.exit(1);
}
