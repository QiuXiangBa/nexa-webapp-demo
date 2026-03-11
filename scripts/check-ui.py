from playwright.sync_api import sync_playwright
import os

BASE = 'http://localhost:5174/#'
OUT = '/tmp/nexa-ui-check'
os.makedirs(OUT, exist_ok=True)

VIEWPORT = {'width': 390, 'height': 844}  # iPhone 14

def shot(page, name):
    page.screenshot(path=f'{OUT}/{name}.png', full_page=True)
    print(f'✓ {name}')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport=VIEWPORT)

    # Mock 模式直接跳过登录，先看看 auth 页
    page.goto(f'{BASE}/auth')
    page.wait_for_load_state('networkidle')
    shot(page, '01-auth')

    # 用 mock token 绕过登录（直接写 localStorage）
    page.evaluate("""() => {
        localStorage.setItem('nexa_session', JSON.stringify({
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh'
        }));
    }""")

    # 首页
    page.goto(f'{BASE}/home')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)
    shot(page, '02-home')

    # 首页 - 切换到中证收益
    tabs = page.locator('.home-income-tabs .van-tab')
    if tabs.count() > 1:
        tabs.nth(1).click()
        page.wait_for_timeout(800)
        shot(page, '03-home-zspace-tab')

    # 首页 - 收益趋势切换 30日
    trend_tabs = page.locator('.switch-tabs .van-tab')
    if trend_tabs.count() > 1:
        trend_tabs.nth(1).click()
        page.wait_for_timeout(800)
        shot(page, '04-home-trend-30d')

    # 首页 - 切换收益分布
    mode_tabs = page.locator('.section-mode-tabs .van-tab')
    if mode_tabs.count() > 1:
        mode_tabs.nth(1).click()
        page.wait_for_timeout(600)
        shot(page, '05-home-distribution')

    # 我的页面
    page.goto(f'{BASE}/me')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    shot(page, '06-me')

    # 商家申请说明页
    page.goto(f'{BASE}/merchant-apply/guide')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    shot(page, '07-merchant-guide')

    # 达人申请说明页
    page.goto(f'{BASE}/expert-apply/guide')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    shot(page, '08-expert-guide')

    browser.close()

print(f'\n截图保存在 {OUT}/')
