import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  
  // 测试超时时间 - 增加到 90 秒以应对网络延迟
  timeout: 90 * 1000,
  
  // 并发运行测试
  fullyParallel: true,
  
  // CI 环境下失败重试 2 次以应对网络波动
  retries: process.env.CI ? 2 : 1,
  
  // CI 环境下使用 2 个 worker 提高速度，本地使用全部核心
  workers: process.env.CI ? 2 : undefined,
  
  // 测试报告
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  use: {
    // 基础 URL
    baseURL: 'http://localhost:3000',
    
    // 导航超时 - 增加到 60 秒
    navigationTimeout: 60 * 1000,
    
    // 操作超时 - 30 秒
    actionTimeout: 30 * 1000,
    
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
