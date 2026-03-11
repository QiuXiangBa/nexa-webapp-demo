<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <header class="space-header">
    <h2 class="space-header-title">{{ title }}</h2>
    <p class="space-header-subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.space-header {
  text-align: center;
}

.space-header-title {
  margin: 0;
  width: calc(340 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  min-height: calc(60 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1.2;
}

.space-header-subtitle {
  margin: calc(8 * 100vw / var(--nexa-design-width)) 0 0;
  width: calc(260 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  min-height: calc(40 * 100vw / var(--nexa-design-width));
  color: #3fbbfa;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1.4;
  text-align: left;
  white-space: pre-line;
}
</style>
