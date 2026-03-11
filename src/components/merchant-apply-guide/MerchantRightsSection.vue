<script setup lang="ts">
// 发行方权责说明模块
interface RightsItem {
  title: string;
  content: string;
  isWarning?: boolean;
}

defineProps<{
  items: RightsItem[];
  neutralRules: string[];
  stageIntro: string;
  stageRules: string[];
}>();
</script>

<template>
  <section class="rights-section">
    <div class="section-head">
      <span class="section-index">1</span>
      <h2>发行方权责说明</h2>
    </div>

    <div class="section-body">

      <article v-for="item in items" :key="item.title" class="rights-item">
        <h3 :class="{ warning: item.isWarning }">{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </article>

      <article class="rights-item">
        <h3>平台中立与规则保障</h3>
        <ul>
          <li v-for="rule in neutralRules" :key="rule">{{ rule }}</li>
        </ul>
      </article>

      <article class="rights-item">
        <h3 class="warning">*关于本产品当前阶段的说明*</h3>
        <p>{{ stageIntro }}</p>
        <ul>
          <li v-for="rule in stageRules" :key="rule">{{ rule }}</li>
        </ul>
      </article>
    </div>

  </section>
</template>

<style scoped>
.rights-section {
  margin-top: calc(14 * 100vw / var(--nexa-design-width));
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
.section-body{
  padding-left: calc(24 * 100vw / var(--nexa-design-width));
  padding-right: calc(24 * 100vw / var(--nexa-design-width));
}

.section-head h2 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.rights-item {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.rights-item h3 {
  margin: 0;
  color: #3973ec;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.rights-item h3.warning {
  color: #ff0000;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
}

.rights-item p {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #363636;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
  white-space: pre-line;
}

.rights-item ul {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  padding-left: calc(12 * 100vw / var(--nexa-design-width));
}

.rights-item li {
  color: #363636;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
}
</style>
