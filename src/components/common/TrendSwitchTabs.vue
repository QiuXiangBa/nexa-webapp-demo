<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options?: string[];
  }>(),
  {
    modelValue: '7日趋势',
    options: () => ['7日趋势', '30日趋势', '90日趋势']
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <van-tabs :active="props.modelValue" class="switch-tabs" :border="false" @change="(name: string | number) => emit('update:modelValue', String(name))">
    <van-tab v-for="option in props.options" :key="option" :name="option" :title="option" />
  </van-tabs>
</template>

<style scoped>
.switch-tabs :deep(.van-tabs__wrap) {
  height: calc(24 * 100vw / var(--nexa-design-width));
}

.switch-tabs :deep(.van-tabs__nav) {
  background: transparent;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.switch-tabs :deep(.van-tab) {
  width: calc(72 * 100vw / var(--nexa-design-width));
  height: calc(18 * 100vw / var(--nexa-design-width));
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: var(--nexa-radius-sm);
  background: var(--nexa-color-surface-card);
  color: var(--nexa-color-black);
  font-size: calc(8 * 100vw / var(--nexa-design-width)) !important;
  font-weight: 400;
  line-height: 1;
  padding: 0;
}

.switch-tabs :deep(.van-tab--active) {
  border-color: var(--nexa-color-brand-primary);
  font-size: calc(10 * 100vw / var(--nexa-design-width)) !important;
}

.switch-tabs :deep(.van-tabs__line) {
  display: none;
}
</style>
