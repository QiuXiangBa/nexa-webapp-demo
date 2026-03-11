import { defineConfig, devices } from '@playwright/test';

// 视觉回归专用配置：
// 1) 独立端口，避免与其它 e2e 流程冲突
// 2) 固定本地地址，保证截图环境稳定
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:4273',
    trace: 'on-first-retry',
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4273',
    url: 'http://127.0.0.1:4273',
    reuseExistingServer: true,
    timeout: 120_000
  }
});
