<script setup lang="ts">
import AppTopBarOverlay from '@/components/common/AppTopBarOverlay.vue';

// 地图模式浮层顶栏。
// props.modelValue: 搜索框当前关键字
// props.searchIconUrl: 搜索按钮图标
// emit.update:modelValue: 同步输入内容
// emit.search: 点击搜索按钮
// emit.back: 点击返回按钮
const props = defineProps<{
  modelValue: string;
  searchIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'search'): void;
  (event: 'back'): void;
}>();

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <AppTopBarOverlay :height-px="74">
    <template #content>
      <div class="map-overlay-row">
        <button type="button" class="back-btn" aria-label="返回" @click="emit('back')">
          <svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div class="search-bar">
          <input
            :value="props.modelValue"
            type="text"
            class="search-input"
            placeholder="输入数字资产名称搜索"
            @input="onInput"
          />
          <button type="button" class="search-btn" aria-label="搜索" @click="emit('search')">
            <img :src="props.searchIconUrl" alt="" />
          </button>
        </div>
      </div>
    </template>
  </AppTopBarOverlay>
</template>

<style scoped>
.map-overlay-row {
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  padding: calc(36 * 100vw / var(--nexa-design-width)) calc(15 * 100vw / var(--nexa-design-width)) calc(8 * 100vw / var(--nexa-design-width));
}

.back-btn {
  flex-shrink: 0;
  width: calc(30 * 100vw / var(--nexa-design-width));
  height: calc(30 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  backdrop-filter: blur(6px);
}

.back-btn svg {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
}

.search-bar {
  flex: 1;
  min-width: 0;
  height: calc(30 * 100vw / var(--nexa-design-width));
  border: 1px solid #3fbbfa;
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.24);
  display: grid;
  grid-template-columns: 1fr calc(42 * 100vw / var(--nexa-design-width));
  align-items: center;
  backdrop-filter: blur(6px);
}

.search-input {
  border: 0;
  outline: none;
  background: transparent;
  padding: 0 calc(12 * 100vw / var(--nexa-design-width));
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  color: #000;
}

.search-input::placeholder {
  color: #b1b1b1;
}

.search-btn {
  margin-right: calc(2 * 100vw / var(--nexa-design-width));
  width: calc(41 * 100vw / var(--nexa-design-width));
  height: calc(26 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  background: #3fbbfa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn img {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
}
</style>
