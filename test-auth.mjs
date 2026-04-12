import https from 'https';

const testSignup = async (email, password, fullName) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password, fullName });
    
    const options = {
      hostname: 'ds-160-ten.vercel.app',
      port: 443,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n📊 注册测试结果 (${email}):`);
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应头:`, res.headers);
        
        try {
          const json = JSON.parse(body);
          console.log(`响应体:`, JSON.stringify(json, null, 2));
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          console.log(`响应体 (非JSON):`, body);
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ 请求失败:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const testLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    
    const options = {
      hostname: 'ds-160-ten.vercel.app',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n📊 登录测试结果 (${email}):`);
        console.log(`状态码: ${res.statusCode}`);
        console.log(`Set-Cookie:`, res.headers['set-cookie']);
        
        try {
          const json = JSON.parse(body);
          console.log(`响应体:`, JSON.stringify(json, null, 2));
          resolve({ status: res.statusCode, headers: res.headers, data: json, cookies: res.headers['set-cookie'] });
        } catch (e) {
          console.log(`响应体 (非JSON):`, body);
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ 请求失败:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const testDashboard = async (cookies) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ds-160-ten.vercel.app',
      port: 443,
      path: '/dashboard',
      method: 'GET',
      headers: {
        'Cookie': cookies.join('; ')
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n📊 Dashboard 访问测试:`);
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应长度: ${body.length} 字节`);
        console.log(`是否包含 "Dashboard": ${body.includes('Dashboard') || body.includes('dashboard')}`);
        resolve({ status: res.statusCode, bodyLength: body.length });
      });
    });

    req.on('error', (error) => {
      console.error(`❌ 请求失败:`, error.message);
      reject(error);
    });

    req.end();
  });
};

(async () => {
  console.log('🚀 开始测试注册登录流程...\n');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'test123456';
  const testName = 'Test User';
  
  try {
    // 1. 测试注册
    console.log('='.repeat(50));
    console.log('第 1 步: 测试注册');
    console.log('='.repeat(50));
    const signupResult = await testSignup(testEmail, testPassword, testName);
    
    if (signupResult.status === 200 || signupResult.status === 201) {
      console.log('✅ 注册成功！');
    } else {
      console.log(`⚠️  注册返回非 200 状态码: ${signupResult.status}`);
    }
    
    // 等待 2 秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. 测试登录
    console.log('\n' + '='.repeat(50));
    console.log('第 2 步: 测试登录');
    console.log('='.repeat(50));
    const loginResult = await testLogin(testEmail, testPassword);
    
    if (loginResult.status === 200 && loginResult.data.success) {
      console.log('✅ 登录成功！');
      console.log(`用户 ID: ${loginResult.data.user.id}`);
      console.log(`用户邮箱: ${loginResult.data.user.email}`);
      
      // 3. 测试 Dashboard 访问
      if (loginResult.cookies && loginResult.cookies.length > 0) {
        console.log('\n' + '='.repeat(50));
        console.log('第 3 步: 测试 Dashboard 访问');
        console.log('='.repeat(50));
        await testDashboard(loginResult.cookies);
      }
    } else {
      console.log(`⚠️  登录失败: ${loginResult.status}`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 测试完成！');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ 测试过程中出错:', error.message);
    process.exit(1);
  }
})();
