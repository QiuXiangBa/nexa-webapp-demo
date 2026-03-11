# 屏幕适配方案 V2

## 1. 结论

`nexa-webapp` 后续统一采用：

- 单一基线：`390`
- 单一主适配轴：`width`
- 业务区块尺寸：优先按宽度缩放
- `dvh`：仅允许用于“屏幕级容器”，禁止用于普通业务组件高度缩放

这份规范用于替换当前仓库内“高度按 `100dvh / 844` 缩放”的旧口径。

## 2. 为什么要调整

当前仓库存在大量写法：

```css
height: calc(N * 100dvh / var(--nexa-design-height));
```

这会让元素高度跟随真实屏幕高度变化：

- 设计稿高：`844`
- 真机可视高如果是 `932`
- 元素会整体放大到 `932 / 844 = 1.104`

结果是：

- 卡片、按钮、标题区、列表项会被纵向拉伸
- 不同长宽比设备视觉差异明显
- 地址栏收起/展开时，`dvh` 还会动态变化，造成抖动

对 Figma 还原来说，这不是合理的移动端适配方式。

## 3. 最终规范

### 3.1 允许保留 `dvh` 的场景

只允许用于“屏幕级”或“视口级”容器：

- `body`
- `#app`
- `AppShell`
- 整页全屏 Frame
- 全屏地图容器
- Drawer / BottomSheet / Popup 的最大高度
- 需要跟随浏览器可视区变化的安全区容器

典型写法：

```css
min-height: 100dvh;
max-height: 100dvh;
```

或者：

```css
max-height: calc(280 * 100dvh / var(--nexa-design-height));
```

这里的 `dvh` 作用是“限制容器不超出当前可视区”，不是拿来缩放业务组件。

### 3.2 禁止使用 `dvh` 的场景

以下场景全部禁止再写 `100dvh / var(--nexa-design-height)`：

- 按钮高度
- 卡片高度
- 列表项高度
- Header 高度
- 搜索框高度
- 图标上下间距
- `padding-top / padding-bottom`
- `margin-top / margin-bottom`
- `gap`
- `line-height`
- `top / bottom` 定位偏移
- 阴影模糊半径
- 文本块固定高度

一句话：

业务组件不要再按“屏幕高度”缩放。

### 3.3 业务样式怎么写

#### 方案 A：目标方案

业务源码直接写设计稿 `px`，交给 `postcss-px-to-viewport` 统一转 `vw`。

优点：

- 写法最简单
- 视觉缩放轴统一
- 不需要手写大量 `calc(...)`
- 更适合后续 Figma 还原流水线

#### 方案 B：过渡方案

如果手写公式，则宽高、间距、字号统一按宽度轴换算：

```css
width: calc(N * 100vw / var(--nexa-design-width));
height: calc(N * 100vw / var(--nexa-design-width));
padding-top: calc(N * 100vw / var(--nexa-design-width));
margin-bottom: calc(N * 100vw / var(--nexa-design-width));
font-size: calc(N * 100vw / var(--nexa-design-width));
line-height: calc(N * 100vw / var(--nexa-design-width));
border-radius: calc(N * 100vw / var(--nexa-design-width));
```

### 3.4 高度怎么设计

优先级如下：

1. `height: auto`
2. `min-height`
3. `aspect-ratio`
4. 宽度轴换算后的固定高

推荐示例：

```css
.banner {
  width: 100%;
  aspect-ratio: 340 / 130;
}

.action-button {
  height: calc(40 * 100vw / var(--nexa-design-width));
}

.panel {
  min-height: calc(120 * 100vw / var(--nexa-design-width));
}
```

## 4. 当前仓库扫描结果

截至本次扫描：

- 样式文件总数：`103`
- 使用新基线公式的文件数：`87`
- 含 `dvh` 的文件数：`86`
- 含 `dvh` 的行数：`560`
- 旧 `100vh` 混用：`0`

说明：

- 当前仓库已经统一到 `390` 基线
- 但“高度缩放轴”仍然大量使用 `dvh`
- 这意味着基线统一了，纵向策略还没有统一

## 5. 第一批必须改的文件

### P0：先改全局基础层

这些文件会影响所有页面，必须先统一：

- `src/components/common/PageContainer.vue`
  - 当前 `paddingTop / paddingBottom` 仍按 `100dvh` 缩放
  - 应改为宽度轴缩放
- `src/styles.css`
  - 包含大量公共区块、TabBar 内部间距、通用列表模块的 `dvh`
  - 这里不改，页面层会持续继承旧口径

### P0：核心入口页

这些是最常展示、最容易暴露拉伸问题的页面：

- `src/views/HomeView.vue`
- `src/views/TradeView.vue`
- `src/views/MerchantMapView.vue`
- `src/views/MeView.vue`

### P0：屏幕级但存在业务高度缩放的特殊页

这些页面虽然是独立页，但内部大量业务元素用了 `dvh`，不能因为“全屏页”就全部保留：

- `src/views/MerchantMapDefaultView.vue`
- `src/views/ConsumerIncomeDetailView.vue`
- `src/views/ZSpaceIncomeDetailView.vue`
- `src/views/MyWalletView.vue`

## 6. 第二批建议改的组件

这些组件会反复复用，改完可以降低后续页面修正成本：

- `src/components/home/ConsumerIncomeBlock.vue`
- `src/components/trade/TradeAssetCard.vue`
- `src/components/wallet/WalletActionSection.vue`
- `src/components/me/MeProfileCard.vue`
- `src/components/common/TrendChartCard.vue`
- `src/components/contract-sign/ContractSignPaper.vue`

## 7. 暂时可保留 `dvh` 的文件

以下文件中的 `dvh` 主要用于“视口级容器约束”，可以暂时保留，但仍需逐段核查：

- `src/styles.css`
  - `body`
  - `#app`
  - `.app-shell`
  - `.mobile-frame`
- `src/views/MerchantMapDefaultView.vue`
  - 地图全屏容器
  - 底部浮层最大高度

注意：

这些文件不是“整文件都允许 `dvh`”，而是“只有视口级容器相关部分允许保留”。

## 8. 落地顺序

建议顺序：

1. 先改 `PageContainer.vue`
2. 再清理 `src/styles.css`
3. 然后改四个核心页：
   - `HomeView.vue`
   - `TradeView.vue`
   - `MerchantMapView.vue`
   - `MeView.vue`
4. 再改详情页和复用组件
5. 最后补视觉回归基线

## 9. 后续执行规则

从现在开始：

- 新页面禁止新增 `calc(N * 100dvh / var(--nexa-design-height))`
- 新组件高度、间距、字号统一走宽度轴
- `dvh` 只允许出现在视口级容器

如果需要继续推进，可以按这份文件直接拆下一轮 issue。
