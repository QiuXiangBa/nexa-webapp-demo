<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppTopBarHost from '@/components/common/AppTopBarHost.vue';
import AppShell from '@/components/common/AppShell.vue';
import PageContainer from '@/components/common/PageContainer.vue';

const route = useRoute();
// 路由可通过 meta.showBottomTab 显式控制底部导航显示，默认显示。
const showBottomTab = computed(() => route.meta.showBottomTab !== false);

interface PageContainerMeta {
  paddingTop?: number;
  paddingBottom?: number;
  paddingX?: number;
  background?: string;
  withSafeBottom?: boolean;
  fullHeight?: boolean;
}

const pageContainerMeta = computed<PageContainerMeta>(() => {
  return (route.meta.pageContainer as PageContainerMeta | undefined) || {};
});

const containerProps = computed(() => {
  return {
    paddingTop: pageContainerMeta.value.paddingTop ?? 0,
    paddingBottom: pageContainerMeta.value.paddingBottom ?? 0,
    paddingX: pageContainerMeta.value.paddingX ?? 0,
    background: pageContainerMeta.value.background ?? 'transparent',
    withSafeBottom: pageContainerMeta.value.withSafeBottom ?? showBottomTab.value,
    fullHeight: pageContainerMeta.value.fullHeight ?? true
  };
});
</script>

<template>
  <AppShell :show-bottom-tab="showBottomTab">
    <AppTopBarHost />
    <PageContainer v-bind="containerProps">
      <main>
        <router-view />
      </main>
    </PageContainer>
  </AppShell>
</template>
