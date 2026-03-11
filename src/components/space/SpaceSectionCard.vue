<script setup lang="ts">
export interface SpaceSection {
  key: 'what' | 'how' | 'value';
  title: string;
  lines: string[];
}

defineProps<{
  section: SpaceSection;
}>();
</script>

<template>
  <article class="space-section-card" :class="`section-${section.key}`">
    <h3 class="space-section-title">{{ section.title }}</h3>
    <div class="space-section-content">
      <p v-for="(line, index) in section.lines" :key="`${section.key}-${index}`" class="space-section-line">{{ line }}</p>
    </div>
  </article>
</template>

<style scoped>
.space-section-card {
  margin-top: calc(20 * 100vw / var(--nexa-design-width));
}

.space-section-title {
  margin: 0;
  width: calc(307 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  min-height: calc(20 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  color: #3fbbfa;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1.2;
}

.space-section-content {
  margin-top: 0;
  width: calc(307 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  padding: calc(12 * 100vw / var(--nexa-design-width)) calc(14 * 100vw / var(--nexa-design-width));
}

.section-what .space-section-content {
  min-height: calc(130 * 100vw / var(--nexa-design-width));
}

.section-how .space-section-content {
  min-height: calc(121 * 100vw / var(--nexa-design-width));
}

.section-value .space-section-content {
  min-height: calc(111 * 100vw / var(--nexa-design-width));
}

.space-section-line {
  margin: 0;
  color: #363636;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(14 * 100vw / var(--nexa-design-width));
  text-align: center;
}

.space-section-line + .space-section-line {
  margin-top: calc(2 * 100vw / var(--nexa-design-width));
}
</style>
