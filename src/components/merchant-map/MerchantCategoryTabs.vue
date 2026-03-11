<script setup lang="ts">
// 商家地图分类 Tab
// props.items: 分类列表（附近/餐饮/便利店/电影/其他）
// props.activeKey: 当前激活分类 key
// emit.change: 用户切换分类时抛出 key
export interface MerchantCategory {
  key: string;
  label: string;
}

defineProps<{
  items: MerchantCategory[];
  activeKey: string;
}>();

const emit = defineEmits<{
  (e: 'change', key: string): void;
}>();
</script>

<template>
  <div class="merchant-category-tabs">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      class="merchant-category-tab"
      :class="{ active: item.key === activeKey }"
      @click="emit('change', item.key)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.merchant-category-tabs {
  /* 分类行紧贴分割线下方，按设计稿均匀横排 */
  display: flex;
  align-items: center;
  gap: calc(16 * 100vw / var(--nexa-design-width));
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
}

.merchant-category-tab {
  border: 0;
  background: transparent;
  padding: 0;
  color: #9fa7b6;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 500;
  cursor: pointer;
}

.merchant-category-tab.active {
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}
</style>
