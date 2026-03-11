import { expect, test } from '@playwright/test';

// UI 视觉回归基线
// 目标：固定 360 / 390 / 430 三档宽度，覆盖核心入口页与个人中心核心子页。
const VIEWPORT_HEIGHT = 844;
const VIEWPORT_WIDTHS = [360, 390, 430] as const;
const FIXED_NOW = Date.UTC(2026, 1, 1, 8, 0, 0);

const PAGES = [
  { key: 'home', path: '/#/home', readySelector: '.home-page' },
  { key: 'trade', path: '/#/trade', readySelector: '.trade-page' },
  { key: 'merchant-map', path: '/#/merchant-map', readySelector: '.merchant-map-page' },
  { key: 'me', path: '/#/me', readySelector: '.me-page' },
  { key: 'me-wallet', path: '/#/me/wallet', readySelector: '.my-wallet-page' },
  { key: 'consumer-income-detail', path: '/#/home/consumer-income-detail', readySelector: '.consumer-income-detail-page' },
  { key: 'zspace-income-detail', path: '/#/home/zspace-income-detail', readySelector: '.zspace-income-detail-page' }
] as const;

for (const width of VIEWPORT_WIDTHS) {
  test.describe(`ui-visual-baseline-${width}`, () => {
    test.use({
      viewport: {
        width,
        height: VIEWPORT_HEIGHT
      }
    });

    for (const pageItem of PAGES) {
      test(`${pageItem.key} should match ${width}px baseline`, async ({ page }) => {
        // 固定 Date.now，避免 mock 时间字段导致视觉基线每次抖动。
        await page.addInitScript((fixedNow: number) => {
          const NativeDate = Date;
          class MockDate extends NativeDate {
            constructor(...args: ConstructorParameters<typeof NativeDate>) {
              if (args.length === 0) {
                super(fixedNow);
                return;
              }
              super(...args);
            }

            static now() {
              return fixedNow;
            }
          }
          MockDate.parse = NativeDate.parse;
          MockDate.UTC = NativeDate.UTC;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).Date = MockDate;
        }, FIXED_NOW);

        await page.goto(pageItem.path);
        await page.waitForLoadState('networkidle');
        await page.waitForSelector(pageItem.readySelector, { state: 'visible' });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(150);

        await expect(page).toHaveScreenshot(`baseline-${pageItem.key}-${width}.png`, {
          fullPage: false,
          animations: 'disabled',
          caret: 'hide'
        });
      });
    }
  });
}
