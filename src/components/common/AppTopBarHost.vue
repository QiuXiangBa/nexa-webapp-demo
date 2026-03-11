<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppTopBarOverlay from '@/components/common/AppTopBarOverlay.vue';
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';
import AppTopBarTab from '@/components/common/AppTopBarTab.vue';
import type { NavBarMeta } from '@/types/nav-bar';

// 顶栏宿主组件。
// 负责：读取 route.meta.navBar 并分发到对应顶栏实现。
// 不负责：custom 页的大头部，custom 模式应由页面自己渲染。
const route = useRoute();

const navBarMeta = computed<NavBarMeta | null>(() => {
  return (route.meta.navBar as NavBarMeta | undefined) || null;
});
</script>

<template>
  <AppTopBarStandard
    v-if="navBarMeta?.mode === 'standard'"
    :title="navBarMeta.title || ''"
    :subtitle="navBarMeta.subtitle"
    :show-back="navBarMeta.showBack"
    :fallback-path="navBarMeta.fallbackPath"
    :right-action="navBarMeta.rightAction"
    :bordered="navBarMeta.bordered"
  />

  <AppTopBarOverlay
    v-else-if="navBarMeta?.mode === 'overlay'"
    :title="navBarMeta.title || ''"
    :fallback-path="navBarMeta.fallbackPath"
    :right-action="navBarMeta.rightAction"
  />

  <AppTopBarTab
    v-else-if="navBarMeta?.mode === 'tab'"
    :title="navBarMeta.title"
    :right-action="navBarMeta.rightAction"
  />
</template>
