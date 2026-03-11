<script setup lang="ts">
// 中证收益详情页（Figma node: 48:2574）
// 负责：分润详情展示，不负责通用顶栏与底部导航。

const merchantLogoUrl = '/pages/zspace-income-detail/f134c7c4-d2ff-4056-aa49-aeab7f294bed.png';

const timeline = [
  { date: '02-01', label: '消费产生' },
  { date: '02-07', label: '订单完结' },
  { date: '02-07', label: '分润发行' }
];
</script>

<template>
  <div class="zspace-income-detail-page">
    <section class="summary">
      <div class="summary-title">收益来源</div>
      <div class="merchant-line">
        <img :src="merchantLogoUrl" alt="" class="merchant-logo" />
        <span>麦当劳</span>
      </div>
      <div class="income-amount">+ 0.5</div>

      <div class="ratio-row">
        <span class="ratio-label">数字资产发行比例</span>
        <span class="ratio-value">0.02 %</span>
      </div>
    </section>

    <van-steps direction="vertical" :active="timeline.length - 1" class="income-steps">
      <van-step v-for="item in timeline" :key="`${item.date}-${item.label}`">
        <span class="step-date">{{ item.date }}</span>
        <span class="step-label">{{ item.label }}</span>
      </van-step>
    </van-steps>

    <section class="footer-info">
      <div class="divider" />
      <div class="publish-label">发行时间</div>
      <div class="publish-time">2026 - 02 - 07&nbsp;&nbsp;00:57</div>
    </section>
  </div>
</template>

<style scoped>
.zspace-income-detail-page {
  min-height: 100%;
}

.summary {
  margin-top: calc(38 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-title {
  color: #363636;
  font-size: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(40 * 100vw / var(--nexa-design-width));
}

.merchant-line {
  margin-top: calc(18 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  color: #070707;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.merchant-logo {
  width: calc(30 * 100vw / var(--nexa-design-width));
  height: calc(30 * 100vw / var(--nexa-design-width));
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
}

.income-amount {
  margin-top: calc(24 * 100vw / var(--nexa-design-width));
  color: #363636;
  font-size: calc(50 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(60 * 100vw / var(--nexa-design-width));
}

.ratio-row {
  margin-top: calc(14 * 100vw / var(--nexa-design-width));
  width: calc(230 * 100vw / var(--nexa-design-width));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ratio-label {
  color: #070707;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
}

.ratio-value {
  color: #070707;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
}

.income-steps {
  margin: calc(30 * 100vw / var(--nexa-design-width)) auto 0;
  width: calc(180 * 100vw / var(--nexa-design-width));
  --van-step-active-color: #3fbbfa;
  --van-step-finish-line-color: #3fbbfa;
  --van-step-finish-icon-color: #3fbbfa;
  --van-steps-background: transparent;
}

.step-date,
.step-label {
  color: #3fbbfa;
  font-size: calc(44 * 100vw / var(--nexa-design-width) / 3);
  margin-right: calc(18 * 100vw / var(--nexa-design-width));
}

.footer-info {
  margin-top: calc(18 * 100vw / var(--nexa-design-width));
  padding: 0 calc(14 * 100vw / var(--nexa-design-width));
}

.divider {
  height: 1px;
  background: #b1b1b1;
}

.publish-label {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.publish-time {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}
</style>
