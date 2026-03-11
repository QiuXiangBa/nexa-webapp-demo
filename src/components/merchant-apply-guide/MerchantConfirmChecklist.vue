<script setup lang="ts">
// 发行方确认勾选模块
export interface ConfirmItem {
  key: string;
  label: string;
  checked: boolean;
}

defineProps<{
  items: ConfirmItem[];
}>();

const emit = defineEmits<{
  (event: 'toggle', key: string): void;
}>();

const checkIconUrl = '/pages/merchant-apply-guide/5b7a77df-bfec-4194-a756-1303b19f4955.svg';
</script>

<template>
  <section class="confirm-section">
    <h2>作为发行方，您需要确认：</h2>
    <button v-for="item in items" :key="item.key" type="button" class="confirm-row" @click="emit('toggle', item.key)">
      <span class="checkbox" :class="{ checked: item.checked }">
        <img v-if="item.checked" :src="checkIconUrl" alt="" />
      </span>
      <span class="label">{{ item.label }}</span>
    </button>
  </section>
</template>

<style scoped>
.confirm-section {
  margin-top: calc(20 * 100vw / var(--nexa-design-width));
}

.confirm-section h2 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.confirm-row {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
  width: 100%;
  text-align: left;
  padding-left: calc(16 * 100vw / var(--nexa-design-width));
  padding-right: calc(16 * 100vw / var(--nexa-design-width));
}

.checkbox {
  width: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(12 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
  border: 1px solid #1890c9;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.checkbox img {
  width: calc(8 * 100vw / var(--nexa-design-width));
  height: calc(6 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.label {
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}
</style>
