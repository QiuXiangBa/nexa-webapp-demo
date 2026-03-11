import { expect, test } from '@playwright/test';

test('critical user flow should pass', async ({ page }) => {
  await page.goto('/auth');

  await page.getByRole('textbox', { name: /手机号/ }).fill('13800138000');
  await page.getByRole('textbox', { name: /密码/ }).fill('password123');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page).toHaveURL(/\/home$/);

  await page.getByRole('button', { name: '中证空间' }).click();
  await page.getByRole('button', { name: /数字资产/ }).first().click();
  await expect(page).toHaveURL(/\/merchant-apply$/);

  await page.getByPlaceholder('请输入商家名称').fill('E2E商家');
  await page.getByPlaceholder('请输入营业执照号').fill('LIC-E2E-001');
  await page.getByPlaceholder('请输入联系人').fill('测试联系人');
  await page.getByPlaceholder('请输入联系电话').fill('13900000001');
  await page.getByTestId('merchant-apply-submit').click();
  await expect(page.locator('.el-message').last()).toContainText('申请提交成功');

  await page.getByRole('button', { name: '交易中心' }).click();
  await page.getByTestId('trade-search-input').fill('咖啡');
  await page.keyboard.press('Enter');
  await expect(page.locator('.trade-asset-card').first()).toBeVisible();

  await page.getByRole('button', { name: '我的' }).click();
  await page.getByRole('tab', { name: '提现' }).click();

  await page.locator('.el-select').first().click();
  await page.locator('.el-select-dropdown__item').first().click();
  await page.locator('.el-input-number input').first().fill('1');
  await page.getByTestId('withdraw-submit').click();

  await expect(page.locator('.el-message').last()).toContainText('提现申请已提交');
});
