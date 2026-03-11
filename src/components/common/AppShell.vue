<script setup lang="ts">
import BottomTabBar from '@/components/common/BottomTabBar.vue';

// AppShell：统一页面外壳。
// 负责：主滚动容器 + 底部导航承载 + 安全区结构
// 不负责：页面业务布局（由 PageContainer + 具体页面自身管理）
const props = withDefaults(
  defineProps<{
    showBottomTab?: boolean;
  }>(),
  {
    showBottomTab: true
  }
);
</script>

<template>
  <div class="app-shell">
    <div class="mobile-frame" :class="{ 'mobile-frame-no-tab': !props.showBottomTab }">
      <main class="mobile-main">
        <slot />
      </main>
      <BottomTabBar v-if="props.showBottomTab" />
    </div>
  </div>
</template>

