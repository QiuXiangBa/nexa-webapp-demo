<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="section-title">
    <h3>{{ title }}</h3>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-title h3 {
  margin: 0;
  font-size: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
  color: var(--nexa-color-text-primary);
}

.section-title p {
  margin: var(--nexa-space-6) 0 0;
  color: var(--nexa-color-text-secondary);
  font-size: var(--nexa-font-size-13);
}
</style>
