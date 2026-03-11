<script setup lang="ts">
// 消费收益详情页（Figma node: 45:2520）
// 负责：消费交易详情展示，不负责通用顶栏与底部导航。

const merchantLogoUrl = '/pages/consumer-income-detail/495162f3-208f-491f-bc6d-f3d972e701c8.png';
const tokenIconUrl = '/pages/consumer-income-detail/2442a09f-fce2-4456-acde-5c8513f9f04a.jpg';
</script>

<template>
  <div class="consumer-income-detail-page">
    <section class="merchant-summary">
      <img :src="merchantLogoUrl" alt="" class="merchant-logo" />
      <div class="merchant-name">麦当劳</div>

      <div class="trade-amount">-100.00</div>
      <div class="trade-status">交易成功</div>

      <div class="asset-amount">
        <span>+2</span>
        <img :src="tokenIconUrl" alt="" />
      </div>
      <div class="asset-label">数字资产发型数量</div>
    </section>

    <section class="detail-form">
      <div class="detail-row">
        <span class="label">支付时间</span>
        <span class="value">2026-02-01&nbsp;&nbsp;12:11:57</span>
      </div>
      <div class="detail-row">
        <span class="label">付款方式</span>
        <span class="value">支付宝账户</span>
      </div>
      <div class="detail-row arrow-row">
        <span class="label">商品说明</span>
        <span class="value">麦当劳巨无霸套餐</span>
        <van-icon name="arrow" class="row-arrow" />
      </div>
      <div class="divider" />
      <div class="detail-row">
        <span class="label">数字资产发行比例</span>
        <span class="value">0.02 %</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.consumer-income-detail-page {
  min-height: 100%;
}

.merchant-summary {
  margin-top: calc(20 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.merchant-logo {
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
}

.merchant-name {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
  color: #070707;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(30 * 100vw / var(--nexa-design-width));
}

.trade-amount {
  margin-top: calc(36 * 100vw / var(--nexa-design-width));
  color: #363636;
  font-size: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(60 * 100vw / var(--nexa-design-width));
}

.trade-status {
  margin-top: calc(2 * 100vw / var(--nexa-design-width));
  color: #070707;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
}

.asset-amount {
  margin-top: calc(16 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  color: #363636;
  font-size: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(60 * 100vw / var(--nexa-design-width));
}

.asset-amount img {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
}

.asset-label {
  margin-top: calc(2 * 100vw / var(--nexa-design-width));
  color: #070707;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
}

.detail-form {
  margin-top: calc(28 * 100vw / var(--nexa-design-width));
  padding: 0 calc(10 * 100vw / var(--nexa-design-width));
}

.detail-row {
  min-height: calc(30 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: calc(100 * 100vw / var(--nexa-design-width)) 1fr;
  align-items: center;
}

.label {
  color: #070707;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
}

.value {
  color: #070707;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
}

.arrow-row {
  grid-template-columns: calc(100 * 100vw / var(--nexa-design-width)) 1fr calc(20 * 100vw / var(--nexa-design-width));
}

.row-arrow {
  color: #070707;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  justify-self: end;
}

.divider {
  height: 1px;
  background: #b1b1b1;
  margin: 0;
}
</style>
