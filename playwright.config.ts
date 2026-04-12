import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  
  // 测试超时时间
  timeout: 30 * 1000,
  
  // 并发运行测试
  fullyParallel: true,
  
  // CI 环境下失败不重试，本地重试 1 次
  retries: process.env.CI ? 0 : 1,
  
  // CI 环境下使用 1 个 worker，本地使用全部核心
  workers: process.env.CI ? 1 : undefined,
  
  // 测试报告
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  use: {
    // 基础 URL
    baseURL: 'http://localhost:3000',
    
    // 测试追踪（失败时保留）
    trace: 'retain-on-failure',
    
    // 截图（失败时）
    screenshot: 'only-on-failure',
    
    // 视频（失败时）
    video: 'retain-on-failure',
  },

  // 配置多个浏览器
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 开发服务器配置（本地运行时使用）
  webServer: process.env.CI ? undefined : {
    command: 'npm run preview -- --port 3000',
    port: 3000,
    reuseExistingServer: true,
  },
})
