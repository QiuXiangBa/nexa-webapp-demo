<script setup lang="ts">
export interface MeMenuItemModel {
  key: 'wallet' | 'consume-record' | 'expert-record' | 'contract';
  label: string;
  icon: string;
}

defineProps<{
  item: MeMenuItemModel;
  arrowIcon: string;
}>();

const emit = defineEmits<{
  click: [key: MeMenuItemModel['key']];
}>();
</script>

<template>
  <button type="button" class="me-menu-item" @click="emit('click', item.key)">
    <div class="me-menu-left">
      <img :src="item.icon" :alt="item.label" class="me-menu-icon" />
      <span class="me-menu-label">{{ item.label }}</span>
    </div>
    <img :src="arrowIcon" alt="进入" class="me-menu-arrow" />
  </button>
</template>

<style scoped>
.me-menu-item {
  width: 100%;
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  border-bottom: calc(1 * 100vw / var(--nexa-design-width)) solid #e4e5e5;
  background: #fff;
  padding: 0 calc(20 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.me-menu-left {
  display: flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.me-menu-icon {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.me-menu-label {
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(40 * 100vw / var(--nexa-design-width));
}

.me-menu-arrow {
  width: calc(5 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}
</style>
