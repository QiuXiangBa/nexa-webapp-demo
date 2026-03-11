<script setup lang="ts">
import MeMenuItem, { type MeMenuItemModel } from '@/components/me/MeMenuItem.vue';

defineProps<{
  items: MeMenuItemModel[];
  arrowIcon: string;
}>();

const emit = defineEmits<{
  'click:item': [key: MeMenuItemModel['key']];
}>();
</script>

<template>
  <section class="me-menu-list">
    <MeMenuItem
      v-for="item in items"
      :key="item.key"
      :item="item"
      :arrow-icon="arrowIcon"
      @click="emit('click:item', $event)"
    />
  </section>
</template>

<style scoped>
.me-menu-list {
  margin-top: calc(15 * 100vw / var(--nexa-design-width));
  border-top: calc(1 * 100vw / var(--nexa-design-width)) solid #e4e5e5;
}
</style>
