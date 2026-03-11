<script setup lang="ts">
// 商家资产规则说明模块
// props.rules: 规则项（标题 + 说明文案）
export interface MerchantRuleItem {
  title: string;
  detail: string;
}

defineProps<{
  rules: MerchantRuleItem[];
}>();
</script>

<template>
  <section class="merchant-rules-panel">
    <h2 class="section-title">数字资产规则说明</h2>

    <article v-for="(rule, index) in rules" :key="`${rule.title}-${index}`" class="rule-item">
      <h3 class="rule-title">{{ rule.title }}</h3>
      <p class="rule-detail">{{ rule.detail }}</p>
    </article>
  </section>
</template>

<style scoped>
.merchant-rules-panel {
  width: calc(307 * 100vw / var(--nexa-design-width));
}

.section-title {
  margin: 0;
  color: #7e818d;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.rule-item {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
}

.rule-title {
  margin: 0;
  color: #0a81b4;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  position: relative;
  padding-left: calc(12 * 100vw / var(--nexa-design-width));
}

.rule-title::before {
  content: '';
  position: absolute;
  left: calc(4 * 100vw / var(--nexa-design-width));
  top: 50%;
  width: calc(4 * 100vw / var(--nexa-design-width));
  height: calc(4 * 100vw / var(--nexa-design-width));
  transform: translateY(-50%);
  border-radius: 50%;
  background: #0a81b4;
}

.rule-detail {
  margin: 0;
  color: #989c9e;
  font-size: calc(9 * 100vw / var(--nexa-design-width));
  line-height: calc(14 * 100vw / var(--nexa-design-width));
  white-space: pre-line;
}
</style>
