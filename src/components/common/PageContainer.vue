<script setup lang="ts">
import { computed } from 'vue';

// PageContainer：统一页面内容容器。
// 负责：标准化 padding / 背景 / safe-area 留白，避免页面依赖偶然全局间距。
// 用法：通过路由 meta.pageContainer 显式声明容器参数，页面再管理自身区块布局。
const props = withDefaults(
  defineProps<{
    paddingTop?: number;
    paddingBottom?: number;
    paddingX?: number;
    background?: string;
    withSafeBottom?: boolean;
    fullHeight?: boolean;
  }>(),
  {
    paddingTop: 0,
    paddingBottom: 0,
    paddingX: 0,
    background: 'transparent',
    withSafeBottom: false,
    fullHeight: true
  }
);

const containerStyle = computed<Record<string, string>>(() => {
  const safeBottom = props.withSafeBottom ? 'env(safe-area-inset-bottom, 0px)' : '0px';
  return {
    // 页面内容区属于业务编排层，间距统一按宽度轴缩放，避免不同屏幕高度拉伸上下留白。
    '--page-padding-top': `calc(${props.paddingTop} * 100vw / var(--nexa-design-width))`,
    '--page-padding-bottom': `calc(${props.paddingBottom} * 100vw / var(--nexa-design-width))`,
    '--page-padding-x': `calc(${props.paddingX} * 100vw / var(--nexa-design-width))`,
    '--page-bg': props.background,
    '--page-safe-bottom': safeBottom
  };
});
</script>

<template>
  <section
    class="page-container"
    :class="{ 'page-container-full-height': props.fullHeight }"
    :style="containerStyle"
  >
    <slot />
  </section>
</template>

<style scoped>
.page-container {
  width: 100%;
  background: var(--page-bg);
  padding-top: var(--page-padding-top);
  padding-right: var(--page-padding-x);
  padding-left: var(--page-padding-x);
  padding-bottom: calc(var(--page-padding-bottom) + var(--page-safe-bottom));
}

.page-container-full-height {
  min-height: 100%;
}
</style>
