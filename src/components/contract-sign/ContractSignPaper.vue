<script setup lang="ts">
export interface ContractSignClause {
  title: string;
  paragraphs: string[];
}

// 智能合约正文区
// props.mainTitle: 合约大标题
// props.metaLines: 版本/存证信息
// props.partOneClauses: 第一部分条款
// props.partTwoClauses: 第二部分条款
const props = defineProps<{
  mainTitle: string;
  metaLines: string[];
  partOneClauses: ContractSignClause[];
  partTwoIntro: string;
  partTwoClauses: ContractSignClause[];
}>();
</script>

<template>
  <section class="contract-sign-paper-wrap">
    <div class="contract-sign-paper">
      <div class="contract-sign-paper-inner">
        <h2>{{ props.mainTitle }}</h2>
        <ul class="contract-sign-meta">
          <li v-for="line in props.metaLines" :key="line">{{ line }}</li>
        </ul>

        <article class="contract-sign-part">
          <h3>第一部分：核心商业条款</h3>
          <section v-for="clause in props.partOneClauses" :key="clause.title" class="contract-sign-clause">
            <h4>{{ clause.title }}</h4>
            <p v-for="line in clause.paragraphs" :key="line">{{ line }}</p>
          </section>
        </article>

        <article class="contract-sign-part">
          <h3>第二部分：技术规范与合规约束</h3>
          <p class="part-intro">{{ props.partTwoIntro }}</p>
          <section v-for="clause in props.partTwoClauses" :key="clause.title" class="contract-sign-clause">
            <h4>{{ clause.title }}</h4>
            <p v-for="line in clause.paragraphs" :key="line">{{ line }}</p>
          </section>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contract-sign-paper-wrap {
  padding: 0 calc(18 * 100vw / var(--nexa-design-width));
}

.contract-sign-paper {
  width: calc(354 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  background: #fff;
  border-radius: calc(20 * 100vw / var(--nexa-design-width));
}

.contract-sign-paper-inner {
  width: calc(346 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border: calc(0.5 * 100vw / var(--nexa-design-width)) solid #f4f6f9;
  border-bottom: 0;
  border-radius: calc(18 * 100vw / var(--nexa-design-width)) calc(18 * 100vw / var(--nexa-design-width)) 0 0;
  padding: calc(18 * 100vw / var(--nexa-design-width)) calc(20 * 100vw / var(--nexa-design-width)) calc(16 * 100vw / var(--nexa-design-width));
}

.contract-sign-paper h2 {
  margin: 0;
  color: #000;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: calc(22 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  text-align: center;
}

.contract-sign-meta {
  margin: calc(10 * 100vw / var(--nexa-design-width)) 0 0;
  padding: 0 0 0 calc(12 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(14 * 100vw / var(--nexa-design-width));
}

.contract-sign-meta li {
  margin: 0;
}

.contract-sign-part {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #f4f6f9;
  padding: calc(12 * 100vw / var(--nexa-design-width)) calc(12 * 100vw / var(--nexa-design-width));
}

.contract-sign-part h3 {
  margin: 0;
  color: #000;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  text-align: center;
}

.part-intro {
  margin: calc(10 * 100vw / var(--nexa-design-width)) 0 0;
  color: #000;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.contract-sign-clause {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.contract-sign-clause h4 {
  margin: 0;
  color: #000;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.contract-sign-clause p {
  margin: 0;
  color: #000;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}
</style>
