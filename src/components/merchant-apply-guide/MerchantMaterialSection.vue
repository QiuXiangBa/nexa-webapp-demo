<script setup lang="ts">
// 入驻材料准备模块
export interface MaterialItem {
  key: string;
  title: string;
  desc: string;
  imageUrl: string;
}

defineProps<{
  hint: string;
  materials: MaterialItem[];
}>();
</script>

<template>
  <section class="material-section">
    <div class="section-head">
      <span class="section-index">2</span>
      <h2>入驻材料准备</h2>
    </div>
    <p class="section-hint">{{ hint }}</p>

    <div class="material-list">
      <article v-for="item in materials" :key="item.key" class="material-card">
        <div class="material-main">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <img :src="item.imageUrl" :alt="item.title" class="material-thumb" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.material-section {
  margin-top: calc(16 * 100vw / var(--nexa-design-width));
}

.section-head {
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.section-index {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  background: #3fbbfa;
  color: #fff;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  text-align: center;
  font-weight: 900;
}

.section-head h2 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.section-hint {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0 calc(28 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}

.material-list {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  padding-left: calc(24 * 100vw / var(--nexa-design-width));
  padding-right: calc(24 * 100vw / var(--nexa-design-width));
}

.material-card {
  width: calc(270 * 100vw / var(--nexa-design-width));
  height: calc(70 * 100vw / var(--nexa-design-width));
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: #f7f8f8;
  display: grid;
  grid-template-columns: 1fr calc(73.019 * 100vw / var(--nexa-design-width));
  align-items: center;
  padding: 0 calc(12 * 100vw / var(--nexa-design-width));
}

.material-main h3 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.material-main p {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}

.material-thumb {
  width: calc(73.019 * 100vw / var(--nexa-design-width));
  height: calc(47.84 * 100vw / var(--nexa-design-width));
  object-fit: cover;
  display: block;
  justify-self: end;
}
</style>
