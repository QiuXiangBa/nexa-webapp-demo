# WebApp 顶栏规范

## 目标

统一一级页、二级页、沉浸页的顶栏结构，避免每个页面各写一套返回按钮和标题，降低后续 Figma 还原和页面接入成本。

## 模式定义

### tab

适用：
- 首页
- 商家地图
- 中证空间
- 交易中心
- 我的

规则：
- 不显示返回
- 展示标题、搜索、筛选、消息等一级入口能力
- 与底部 Tab 一起作为一级导航层

### standard

适用：
- 收益详情
- 钱包
- 记录
- 合约
- 码页
- 普通表单与结果页

规则：
- 左返回
- 中间标题
- 可选副标题（用于合约签署、说明类二级页）
- 右侧等宽占位或操作按钮
- 标题单行、省略号、视觉居中
- 当前项目先按 390 设计稿中的 70 高度区实现，避免影响现有页面结构

### overlay

适用：
- 地图全屏页
- 交易详情页
- 大图详情页

规则：
- 顶栏首屏透明悬浮
- 返回按钮覆盖在内容之上
- 滚动后切为实体背景
- 标题在 collapsed 状态显示

### custom

适用：
- 渐变头部页
- 页面自己管理大头图或挂签头部的场景

规则：
- 不走通用顶栏渲染
- 页面自行负责头部结构
- 仍需遵守“返回左侧、标题语义明确”的规则

### none

适用：
- 登录页
- 引导页
- 其他不需要通用顶栏的全屏页

规则：
- 不渲染通用顶栏

## 当前路由映射建议

| 路由 | mode | title | showBack | fallbackPath |
| --- | --- | --- | --- | --- |
| `/auth` | `none` |  |  |  |
| `/home` | `tab` | `数字资产收益` | `false` |  |
| `/merchant-map` | `tab` | `商家地图` | `false` |  |
| `/space` | `tab` | `中证空间` | `false` |  |
| `/trade` | `tab` | `交易中心` | `false` |  |
| `/me` | `tab` | `我的` | `false` |  |
| `/home/consumer-income-detail` | `standard` | `数字资产消费详情` | `true` | `/home` |
| `/home/zspace-income-detail` | `standard` | `数字资产分润详情` | `true` | `/home` |
| `/me/wallet` | `standard` | `数字资产结算` | `true` | `/me` |
| `/me/wallet/withdraw` | `standard` | `提现管理界面` | `true` | `/me/wallet` |
| `/me/consume-record` | `standard` | `收益明细记录` | `true` | `/me` |
| `/me/expert-record` | `standard` | `达人授权记录` | `true` | `/me` |
| `/me/contracts` | `standard` | `我的智能合约` | `true` | `/me` |
| `/me/contracts/detail` | `standard` | `链上智能合约` | `true` | `/me/contracts` |
| `/contract/sign` | `standard` | `链上智能合约` | `true` | `/me` |
| `/me/pay-receive-code` | `standard` | `数字资产付款码` | `true` | `/me` |
| `/me/expert-code` | `standard` | `达人授权码` | `true` | `/me` |
| `/trade/assets/:assetId` | `overlay` | `交易详情` | `true` | `/trade` |
| `/merchant-map/default` | `overlay` | `商家地图` | `true` | `/merchant-map` |
| `/merchant-map/detail` | `custom` | `商家明细` | `true` | `/merchant-map` |
| `/merchant-apply/guide` | `custom` | `商家申请说明` | `true` | `/space` |
| `/merchant-apply` | `custom` | `商家资料填写` | `true` | `/merchant-apply/guide` |
| `/expert-apply/guide` | `custom` | `达人申请说明` | `true` | `/space` |
| `/expert-apply` | `custom` | `达人申请资料填写` | `true` | `/expert-apply/guide` |

## 元信息约定

```ts
interface NavBarMeta {
  mode: 'none' | 'tab' | 'standard' | 'overlay' | 'custom';
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  fallbackPath?: string;
  rightAction?: 'none' | 'more' | 'share' | 'message' | 'scan' | 'filter';
  bordered?: boolean;
  transparent?: boolean;
  collapseOnScroll?: boolean;
}
```

示例：

```ts
meta: {
  navBar: {
    mode: 'standard',
    title: '我的钱包',
    showBack: true,
    fallbackPath: '/me',
    rightAction: 'none',
    bordered: false
  }
}
```

## 组件分层

### AppTopBarStandard
- 给标准二级页使用
- 左返回 + 中标题 + 右侧操作或占位
- 支持可选副标题；有副标题时切换到更高的头部区

### AppTopBarOverlay
- 给沉浸式详情页使用
- 支持透明态和收起态切换
- 支持 `background` 与 `content` 槽位，允许交易详情、地图搜索栏这类页面在复用浮层容器的同时保留自定义视觉内容

### AppTopBarTab
- 给一级 Tab 页使用
- 支持标题、搜索、右侧入口

### AppTopBarHost
- 读取 `route.meta.navBar`
- 分发到具体顶栏组件
- `custom` 和 `none` 不渲染通用顶栏

### AppHeroHeader
- 给蓝色渐变头的 `custom` 页使用
- 支持标题、副标题、挂签装饰、返回按钮
- 用于商家申请说明、达人申请说明、商家资料填写、达人资料填写这类页面

## 当前实现约束

1. `LayoutView` 负责挂 `AppTopBarHost`，适用于其 children 路由
2. 不经过 `LayoutView` 的根路由二级页，可直接在页面内引入 `AppTopBarStandard`，同时仍建议在 route meta 中声明 `navBar`
3. 第一阶段优先统一 `standard` 模式，不动现有一级页头部
4. `custom` 页继续由页面自己维护头部结构；若属于蓝色渐变头样式，优先复用 `AppHeroHeader`
5. 接入通用顶栏时，页面内重复的 `header + back + title` 必须删除，避免双顶栏
6. 合约页这类“标题 + 副标题”场景优先复用 `AppTopBarStandard` 的副标题能力，不再单独造头部组件
7. `overlay` 页允许通过 `AppTopBarOverlay` 的自定义槽复用浮层容器，再把搜索栏、卖家信息等内容作为页面专属实现挂进去

## 交互规则

1. 返回按钮永远在左侧
2. 一级页禁止显示返回
3. 二级页标题默认居中
4. 右侧无操作时保留等宽占位，防止标题视觉偏移
5. 返回优先 `router.back()`，无历史栈时走 `fallbackPath`

## 验收标准

1. 接入通用顶栏的页面不再自带重复头部
2. 标题、返回按钮位置统一
3. 无历史栈返回不报错，能正确跳转 fallbackPath
4. 不影响现有页面内容布局和构建
