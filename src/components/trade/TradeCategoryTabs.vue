<script setup lang="ts">
import { computed } from 'vue';

// 分类标签条（使用 van-tabs 实现，对外 API 不变）
// props.tabs: 分类名称列表
// props.active: 当前激活分类
const props = defineProps<{
  tabs: string[];
  active: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const activeTab = computed({
  get: () => props.active,
  set: (val) => emit('change', val)
});
</script>

<template>
  <van-tabs
    v-model:active="activeTab"
    class="trade-tabs"
    :border="false"
    :swipeable="false"
  >
    <van-tab v-for="tab in tabs" :key="tab" :title="tab" :name="tab" />
  </van-tabs>
</template>

<style scoped>
.trade-tabs {
  height: calc(32 * 100vw / var(--nexa-design-width));
  border-radius: calc(12 * 100vw / var(--nexa-design-width)) calc(12 * 100vw / var(--nexa-design-width)) 0 0;
  overflow: hidden;
}

.trade-tabs :deep(.van-tabs__wrap) {
  height: calc(32 * 100vw / var(--nexa-design-width));
  background: #f2f3f6;
}

.trade-tabs :deep(.van-tabs__nav) {
  background: #f2f3f6;
  padding: 0 calc(11 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: repeat(5, calc(50 * 100vw / var(--nexa-design-width)));
  justify-content: space-between;
  align-items: center;
}

.trade-tabs :deep(.van-tab) {
  flex: none;
  width: calc(50 * 100vw / var(--nexa-design-width));
  height: calc(32 * 100vw / var(--nexa-design-width));
  padding: 0;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 400;
  color: rgba(126, 129, 141, 0.5);
  line-height: 1;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  transition: background 0.2s ease, color 0.2s ease, font-size 0.2s ease, font-weight 0.2s ease;
}

.trade-tabs :deep(.van-tab--active) {
  width: calc(56 * 100vw / var(--nexa-design-width));
  background: #f9faff;
  color: #7e818d;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.trade-tabs :deep(.van-tabs__line) {
  display: none;
}
</style>
