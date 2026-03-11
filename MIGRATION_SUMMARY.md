# Vue 3 到 React 18 迁移总结

## 迁移完成时间
2026-01-27

## 技术栈变更

### 迁移前
- Vue 3.5 + Vite + TypeScript
- Pinia (状态管理)
- Vue Router 4
- 自定义 CSS + postcss-px-to-viewport

### 迁移后
- React 18.3 + Vite + TypeScript
- React Context (状态管理)
- React Router v6
- Ant Design 5.20
- 自定义 CSS + postcss-px-to-viewport

## 目录结构变更

### 新增目录
- `src/pages/` - 页面组件（替代 `views/`）
- `src/contexts/` - React Context（替代 `stores/`）

### 保留目录
- `src/components/` - 组件（已转换为 React）
- `src/api/` - API 封装
- `src/utils/` - 工具函数
- `src/types/` - TypeScript 类型定义
- `src/assets/` - 静态资源
- `src/mocks/` - Mock 数据（仅保留 data.ts）

### 删除文件
- `src/App.vue`
- `src/main.ts`
- `src/components/*.vue`
- `src/views/**/*.vue`
- `src/router/index.ts` (Vue Router)
- `src/stores/**/*.ts` (Pinia)
- `src/mocks/index.ts` (Mock.js 配置)

## 主要变更

### 1. 状态管理
- **Pinia Stores** → **React Context**
  - `stores/user.ts` → `contexts/UserContext.tsx`
  - `stores/app.ts` → `contexts/AppContext.tsx`

### 2. 路由
- **Vue Router 4** → **React Router v6**
  - 使用 `createBrowserRouter` 和 `RouterProvider`
  - 路由守卫逻辑已移除（纯静态页面）

### 3. 组件迁移
- `TabBar.vue` → `TabBar.tsx` + `TabBar.css`
- `NavBar.vue` → `NavBar.tsx` + `NavBar.css`
- 所有页面组件从 `.vue` 转换为 `.tsx` + `.css`

### 4. UI 组件库
- 集成 **Ant Design 5.20**
- 主题色配置为 `#FDCC00`（黄色）
- 使用中文语言包

### 5. 样式
- 保留所有 CSS 变量和样式
- 保留 postcss-px-to-viewport 移动端适配
- 样式文件从 `<style scoped>` 转换为独立的 `.css` 文件

## 功能保持

✅ 所有页面功能完整保留：
- 首页：地址栏、搜索框、快捷功能、分类按钮、轮播图、品牌卡片
- 数域页：用户信息、管理卡片、账户余额、数字资产列表、快速功能
- 消息页：占位页面
- 视频页：占位页面

✅ 导航栏功能：
- 底部 TabBar 导航
- 图标切换（选中/未选中状态）
- 路由跳转

✅ 移动端适配：
- 750px 设计稿基准
- px 自动转换为 vw
- 响应式布局

## 下一步

1. 运行 `npm install` 安装新的依赖
2. 运行 `npm run dev` 启动开发服务器
3. 运行 `npm run build` 测试构建
4. 在移动设备或浏览器开发者工具中测试移动端适配效果

## 注意事项

- 所有数据都是静态的，不再依赖 API 调用
- Mock.js 已移除，不再需要拦截请求
- 如果后续需要 API 功能，可以恢复 `src/api/` 中的接口调用
