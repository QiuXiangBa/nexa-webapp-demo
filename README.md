# nexa-webapp

## 运行模式

- `mock`（默认）：前端本地 mock 数据
- `api`：对接服务端 API

## API 模式启动

1. 复制 `.env.example` 为 `.env.local`
2. 设置 `VITE_API_MODE=api`
3. 设置 `VITE_API_BASE_URL`（例如 `http://localhost:8092`）
4. 执行 `npm run dev`

## UI Token 规范

- Token 文件：`src/styles/tokens.css`
- 命名统一：`--nexa-{category}-{semantic}`
- 示例：
  - `--nexa-color-text-primary`
  - `--nexa-radius-lg`
  - `--nexa-shadow-card`
- 组件优先使用语义 token，不直接写高频硬编码视觉值（颜色/圆角/阴影）

## 布局基础组件

- `AppShell`：统一顶层外壳（主滚动区 + 底部导航 + safe-area）
- `PageContainer`：统一页面内容容器（padding / 背景 / safe-area 参数化）
- 路由可通过 `meta` 显式声明：
  - `showBottomTab`：是否展示底部导航
  - `pageContainer`：容器参数（`paddingTop/paddingBottom/paddingX/background/withSafeBottom/fullHeight`）

## 全局状态组件

- 组件：`src/components/common/AppPageState.vue`
- 统一页面反馈态：
  - `loading`：支持骨架屏或 spinner（默认骨架屏）
  - `empty`：统一空态占位
  - `error`：统一错误态 + 重试按钮
- 事件：
  - `retry`：错误态重试
- 推荐用法：
  - 页面保留头部/筛选等结构，把“数据内容区”放入 `AppPageState` 的默认插槽
  - `state` 推荐按优先级计算：`loading > error > empty > ready`
  - `error` 态建议只在“无可展示数据”时显示，避免覆盖已有可读内容

## 390 适配链路与尺寸规范

### 设计基线

- 固定基线：`390 x 844`
- 核心变量：`src/styles/tokens.css`
  - `--nexa-design-width: 390`
  - `--nexa-design-height: 844`

### PostCSS px->vw 策略

- 配置文件：`vite.config.ts`
- 插件：`postcss-px-to-viewport-8-plugin`
- 转换范围：仅业务样式源码
  - `src/views/**`
  - `src/components/**`
  - `src/styles.css`
- 排除范围：
  - `node_modules/**`
  - `src/styles/tokens.css`

### 尺寸写法约定

- 当前新规范：
  - 业务组件优先按宽度轴适配
  - 推荐直接写设计稿 `px`，交给 PostCSS 统一转 `vw`
  - 如果手写公式，宽高/间距/字号统一写成：`calc(N * 100vw / var(--nexa-design-width))`
- `dvh` 使用边界：
  - 仅允许用于 `AppShell`、全屏页、Drawer/BottomSheet 最大高度等视口级容器
  - 不允许用于普通业务组件高度、间距、行高缩放
- 禁止写法（会被扫描拦截）：
  - `calc(34px * var(--nexa-scale-w))`
  - `calc(20px * 100vw)`

补充说明：
- 仓库内仍存在历史 `dvh` 写法，后续迁移按 `docs/screen-adaptation-v2.md` 执行。

### 尺寸规则扫描

- 命令：`npm run check:size`
- 脚本：`scripts/check-size-rules.mjs`
- 默认在 `npm run build` 前自动执行，发现非法公式将直接失败。

## 业务动态图策略

- UI 静态资源：继续使用项目本地资源（`/pages/...`）
- 业务动态图片：统一经过 `AppBizImage`，执行白名单校验与兜底图回退

环境变量：
- `VITE_BIZ_IMAGE_ALLOWED_HOSTS`：允许的外链图片域名（逗号分隔，支持 `*.domain.com`）
- `VITE_BIZ_IMAGE_CDN_BASE_URL`：后端返回图片 key 时用于拼接的 CDN 基础地址
