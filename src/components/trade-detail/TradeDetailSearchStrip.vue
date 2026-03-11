<script setup lang="ts">
// 交易详情页蓝色搜索条
// props.text: 搜索提示文案
// props.searchIconUrl/arrowIconUrl: 左右图标
// emit.search: 点击搜索条
const props = defineProps<{
  text: string;
  searchIconUrl: string;
  arrowIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'search'): void;
}>();
</script>

<template>
  <button type="button" class="trade-search-strip" @click="emit('search')">
    <img class="search-icon" :src="props.searchIconUrl" alt="" />
    <span class="search-text">{{ props.text }}</span>
    <img class="arrow-icon" :src="props.arrowIconUrl" alt="" />
  </button>
</template>

<style scoped>
.trade-search-strip {
  width: calc(390 * 100vw / var(--nexa-design-width));
  height: calc(37.44 * 100vw / var(--nexa-design-width));
  border: 0;
  background: #3fbbfa;
  display: flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
  padding: 0 calc(31 * 100vw / var(--nexa-design-width));
  margin-bottom: calc(40 * 100vw / var(--nexa-design-width));
}

.search-icon {
  width: calc(20.8 * 100vw / var(--nexa-design-width));
  height: calc(23.92 * 100vw / var(--nexa-design-width));
}

.search-text {
  flex: 1;
  color: #fff;
  font-size: calc(15 * 100vw / var(--nexa-design-width));
  line-height: calc(24 * 100vw / var(--nexa-design-width));
  text-align: left;
}

.arrow-icon {
  width: calc(7.28 * 100vw / var(--nexa-design-width));
  height: calc(14.56 * 100vw / var(--nexa-design-width));
}
</style>
