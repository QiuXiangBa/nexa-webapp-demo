<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options?: string[];
  }>(),
  {
    modelValue: '消费类型',
    options: () => ['消费类型', '消费地区']
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
  width: calc(80 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: var(--nexa-radius-sm);
  background: var(--nexa-color-surface-card);
  color: var(--nexa-color-black);
  font-size: var(--nexa-font-size-8);
  font-weight: 400;
  line-height: 1;
  padding: 0;
}

.switch-tabs :deep(.van-tab--active) {
  border-color: var(--nexa-color-brand-primary);
}

.switch-tabs :deep(.van-tabs__line) {
  display: none;
}
</style>
