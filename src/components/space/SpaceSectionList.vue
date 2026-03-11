<script setup lang="ts">
import SpaceSectionCard, { type SpaceSection } from '@/components/space/SpaceSectionCard.vue';

defineProps<{
  sections: SpaceSection[];
}>();
</script>

<template>
  <section class="space-section-list">
    <SpaceSectionCard v-for="section in sections" :key="section.key" :section="section" />
  </section>
</template>

<style scoped>
.space-section-list {
  margin-top: calc(27 * 100vw / var(--nexa-design-width));
}
</style>
