<script setup lang="ts">
import SpaceEntryCard, { type SpaceEntryItem } from '@/components/space/SpaceEntryCard.vue';

defineProps<{
  items: SpaceEntryItem[];
}>();

const emit = defineEmits<{
  'click:item': [key: SpaceEntryItem['key']];
}>();
</script>

<template>
  <section class="entry-cards">
    <SpaceEntryCard v-for="item in items" :key="item.key" :item="item" @click="emit('click:item', $event)" />
  </section>
</template>

<style scoped>
.entry-cards {
  width: calc(340 * 100vw / var(--nexa-design-width));
  margin: calc(24 * 100vw / var(--nexa-design-width)) auto 0;
  display: grid;
  grid-template-columns: repeat(2, calc(160 * 100vw / var(--nexa-design-width)));
  justify-content: space-between;
}
</style>
