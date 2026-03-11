<script setup lang="ts">
export interface ExpertGuideSection {
  key: string;
  title: string;
  color?: 'normal' | 'primary';
  paragraphs?: string[];
  intro?: string;
  bullets?: string[];
  emphasize?: string;
}

// 达人申请说明正文卡片
// props.introTitle/introParagraphs: 顶部身份说明
// props.sections: 分节内容（适配人群、收益、上链说明等）
const props = defineProps<{
  introTitle: string;
  introParagraphs: string[];
  sections: ExpertGuideSection[];
}>();
</script>

<template>
  <section class="guide-content-card">
    <div class="intro-head">
      <span class="intro-index">1</span>
      <h2>{{ props.introTitle }}</h2>
    </div>

    <div class="intro-body">

      <p v-for="line in props.introParagraphs" :key="line" class="intro-line">{{ line }}</p>

      <article v-for="section in props.sections" :key="section.key" class="section-block">
        <h3 :class="{ primary: section.color === 'primary' }">{{ section.title }}</h3>
        <p v-for="line in section.paragraphs || []" :key="`${section.key}-${line}`" class="block-line">{{ line }}</p>
        <p v-if="section.intro" class="block-line">{{ section.intro }}</p>
        <ul v-if="section.bullets?.length" class="block-bullets">
          <li v-for="item in section.bullets" :key="`${section.key}-${item}`">{{ item }}</li>
        </ul>
        <p v-if="section.emphasize" class="block-emphasize">{{ section.emphasize }}</p>
      </article>
    </div>

  </section>
</template>

<style scoped>
.guide-content-card {
  width: calc(354 * 100vw / var(--nexa-design-width));
  border-top-left-radius: calc(20 * 100vw / var(--nexa-design-width));
  border-top-right-radius: calc(20 * 100vw / var(--nexa-design-width));
  background: #fff;
  padding: calc(36 * 100vw / var(--nexa-design-width)) calc(18 * 100vw / var(--nexa-design-width)) 0;
}

.intro-head {
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.intro-index {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  background: #3fbbfa;
  color: #fff;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  text-align: center;
  font-weight: 900;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
}
.intro-body{
  padding-left: calc(24 * 100vw / var(--nexa-design-width));
  padding-right: calc(24 * 100vw / var(--nexa-design-width));
}

.intro-head h2 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.intro-line {
  margin: calc(4 * 100vw / var(--nexa-design-width)) 0 0;
  color: #989c9e;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
}

.section-block {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
}

.section-block h3 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.section-block h3.primary {
  color: #3973ec;
}

.block-line {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #363636;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
}

.block-bullets {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  padding-left: calc(12 * 100vw / var(--nexa-design-width));
}

.block-bullets li {
  color: #363636;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
}

.block-emphasize {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #ff0000;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}
</style>
