<script setup lang="ts">
import type { NavBarRightAction } from '@/types/nav-bar';

// 一级 Tab 页顶栏。
// props.title: 页标题
// props.showSearch: 是否展示搜索入口
// props.searchPlaceholder: 搜索占位文案
// props.rightAction: 右侧一级功能位
const props = withDefaults(
  defineProps<{
    title?: string;
    showSearch?: boolean;
    searchPlaceholder?: string;
    rightAction?: NavBarRightAction;
  }>(),
  {
    title: '',
    showSearch: false,
    searchPlaceholder: '',
    rightAction: 'none'
  }
);

const emit = defineEmits<{
  (event: 'search'): void;
  (event: 'right-action'): void;
}>();
</script>

<template>
  <header class="app-topbar-tab">
    <div class="topbar-tab-inner">
      <div class="tab-main">
        <h1 v-if="props.title" class="tab-title">{{ props.title }}</h1>
        <button v-if="props.showSearch" type="button" class="tab-search-trigger" @click="emit('search')">
          <span class="tab-search-placeholder">{{ props.searchPlaceholder }}</span>
        </button>
      </div>

      <button v-if="props.rightAction !== 'none'" type="button" class="tab-right-btn" @click="emit('right-action')">
        <slot name="right" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-topbar-tab {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--nexa-z-overlay);
  width: 100%;
  min-height: var(--nexa-topbar-total-height);
  background: transparent;
}

.topbar-tab-inner {
  min-height: var(--nexa-topbar-total-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(25 * 100vw / var(--nexa-design-width));
}

.tab-main {
  flex: 1;
  min-width: 0;
}

.tab-title {
  margin: 0;
  color: var(--nexa-color-black);
  font-size: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  text-align: center;
}

.tab-search-trigger {
  width: 100%;
  min-height: calc(36 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(18 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-white);
}

.tab-search-placeholder {
  color: var(--nexa-color-text-muted);
  font-size: calc(12 * 100vw / var(--nexa-design-width));
}

.tab-right-btn {
  width: var(--nexa-topbar-side-size);
  height: var(--nexa-topbar-side-size);
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
