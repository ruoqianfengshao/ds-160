#!/usr/bin/env node

console.log('🔍 诊断 DS-160 数据库连接问题\n');

// 1. 检查环境变量
console.log('=== 环境变量 ===');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ 已设置' : '✗ 未设置');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ 已设置' : '✗ 未设置');
console.log('');

// 2. 尝试连接数据库
console.log('=== 数据库连接测试 ===');

try {
  const postgres = (await import('postgres')).default;
  const connectionString = process.env.POSTGRES_URL || 'postgresql://ds160_user:ds160_password@localhost:5432/ds160_helper';
  
  console.log('连接字符串:', connectionString.replace(/:[^:@]*@/, ':****@'));
  
  const sql = postgres(connectionString, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 5
  });
  
  console.log('正在连接...');
  const result = await sql`SELECT current_database(), current_user, version()`;
  
  console.log('✅ 数据库连接成功!');
  console.log('  数据库:', result[0].current_database);
  console.log('  用户:', result[0].current_user);
  console.log('  版本:', result[0].version.split(' ')[0] + ' ' + result[0].version.split(' ')[1]);
  console.log('');
  
  // 3. 检查表结构
  console.log('=== 表结构检查 ===');
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  
  if (tables.length > 0) {
    console.log('✅ 找到', tables.length, '个表:');
    tables.forEach(t => console.log('  -', t.table_name));
  } else {
    console.log('⚠️  未找到任何表。数据库可能未初始化。');
    console.log('  运行: node init-db.mjs');
  }
  
  await sql.end();
  console.log('\n✅ 诊断完成');
  process.exit(0);
  
} catch (error) {
  console.error('❌ 数据库连接失败:');
  console.error('  错误:', error.message);
  
  if (error.code) {
    console.error('  错误代码:', error.code);
  }
  
  console.log('\n💡 可能的解决方案:');
  
  if (error.message.includes('ECONNREFUSED')) {
    console.log('  1. PostgreSQL 未运行');
    console.log('     解决: 启动 PostgreSQL 服务');
  } else if (error.message.includes('password authentication failed')) {
    console.log('  1. 数据库密码错误');
    console.log('     解决: 检查 .env 中的 POSTGRES_URL');
  } else if (error.message.includes('does not exist')) {
    console.log('  1. 数据库不存在');
    console.log('     解决: 创建数据库或更新 .env');
  } else {
    console.log('  1. 检查 .env 文件中的 POSTGRES_URL');
    console.log('  2. 确认 PostgreSQL 正在运行');
    console.log('  3. 确认数据库已创建');
  }
  
  console.log('\n建议:');
  console.log('  - 本地开发: 考虑使用 Supabase（免费且易于设置）');
  console.log('  - 查看文档: MIGRATION_GUIDE.md 和 QUICK_SUPABASE_SETUP.md');
  
  process.exit(1);
}
