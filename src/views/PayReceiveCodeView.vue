<script setup lang="ts">
import { ref } from 'vue';
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';

// 付收款码页（Figma node: 54:3000）
// 负责：付款码/收款码切换展示、条码二维码展示、付款方式入口展示
// 不负责：实际支付与扫码业务逻辑（当前为 UI 还原阶段）
const activeTab = ref<'pay' | 'receive'>('pay');

const barcodeUrl = '/pages/pay-receive-code/901140c7-a641-443f-bce0-be5de20e2cd4.png';
const qrCodeUrl = '/pages/pay-receive-code/ce694ca2-8fe3-43e8-b058-b034073c70cd.png';
const avatarUrl = '/pages/pay-receive-code/47b86fd6-bcc6-400f-ac7a-8aa6c40471f9.png';
const payMethodIconUrl = '/pages/pay-receive-code/10e0cc56-e2fa-4b19-8394-355babafd4d3.svg';
const payMethodBgUrl = '/pages/pay-receive-code/74839c72-8dc7-4f41-9ec7-61e57cfd9f2c.svg';
</script>

<template>
  <div class="pay-receive-page">
    <AppTopBarStandard title="数字资产付款码" fallback-path="/me" />

    <div class="code-tabs">
      <button type="button" class="tab-btn" :class="{ active: activeTab === 'pay' }" @click="activeTab = 'pay'">付款码</button>
      <button type="button" class="tab-btn" :class="{ active: activeTab === 'receive' }" @click="activeTab = 'receive'">收款码</button>
    </div>

    <section class="code-card">
      <div class="code-title">我的付款码</div>
      <div class="code-hint">点击查看付款码数字</div>
      <img :src="barcodeUrl" alt="" class="barcode-img" />

      <div class="qr-wrap">
        <img :src="qrCodeUrl" alt="" class="qr-img" />
        <span class="qr-avatar-wrap">
          <img :src="avatarUrl" alt="" class="qr-avatar" />
        </span>
      </div>

      <div class="pay-method-title">付款方式</div>
      <button type="button" class="pay-method-row">
        <span class="pay-method-icon-wrap">
          <img :src="payMethodBgUrl" alt="" class="pay-method-icon-bg" />
          <img :src="payMethodIconUrl" alt="" class="pay-method-icon" />
        </span>
        <span class="pay-method-name">xx数字资产</span>
        <span class="pay-method-arrow">〉</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.pay-receive-page {
  min-height: 100dvh;
  background: #f9faff;
  padding-top: calc(70 * 100vw / var(--nexa-design-width));
}

.code-tabs {
  margin: calc(32 * 100vw / var(--nexa-design-width)) auto 0;
  width: calc(140 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border: 1px solid #ececec;
  border-radius: calc(25 * 100vw / var(--nexa-design-width));
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.tab-btn {
  border: 0;
  background: transparent;
  color: #3fbbfa;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  border-radius: calc(25 * 100vw / var(--nexa-design-width));
}

.tab-btn.active {
  background: #3fbbfa;
  color: #fff;
}

.code-card {
  margin: calc(34 * 100vw / var(--nexa-design-width)) auto 0;
  width: calc(366 * 100vw / var(--nexa-design-width));
  height: calc(430 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  padding: calc(16 * 100vw / var(--nexa-design-width)) calc(23 * 100vw / var(--nexa-design-width)) 0;
}

.code-title {
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(24 * 100vw / var(--nexa-design-width));
}

.code-hint {
  margin-top: calc(22 * 100vw / var(--nexa-design-width));
  padding-top: calc(6 * 100vw / var(--nexa-design-width));
  border-top: 1px solid #ececec;
  text-align: center;
  color: #b3b3b3;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
}

.barcode-img {
  margin-top: calc(4 * 100vw / var(--nexa-design-width));
  width: calc(334 * 100vw / var(--nexa-design-width));
  height: calc(91 * 100vw / var(--nexa-design-width));
  object-fit: cover;
}

.qr-wrap {
  margin: calc(24 * 100vw / var(--nexa-design-width)) auto 0;
  width: calc(134 * 100vw / var(--nexa-design-width));
  height: calc(134 * 100vw / var(--nexa-design-width));
  position: relative;
}

.qr-img {
  width: 100%;
  height: 100%;
}

.qr-avatar-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(36 * 100vw / var(--nexa-design-width));
  height: calc(36 * 100vw / var(--nexa-design-width));
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  background: #fdcc01;
  padding: 2px;
}

.qr-avatar {
  width: 100%;
  height: 100%;
  border-radius: calc(4 * 100vw / var(--nexa-design-width));
}

.pay-method-title {
  margin-top: calc(18 * 100vw / var(--nexa-design-width));
  padding-top: calc(8 * 100vw / var(--nexa-design-width));
  border-top: 1px solid #ececec;
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
}

.pay-method-row {
  width: calc(320 * 100vw / var(--nexa-design-width));
  height: calc(30 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: #f9faff;
  display: grid;
  grid-template-columns: calc(22 * 100vw / var(--nexa-design-width)) 1fr auto;
  align-items: center;
  padding: 0 calc(10 * 100vw / var(--nexa-design-width));
}

.pay-method-icon-wrap {
  position: relative;
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
}

.pay-method-icon-bg,
.pay-method-icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.pay-method-name {
  color: #b3b3b3;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  text-align: left;
  margin-left: calc(4 * 100vw / var(--nexa-design-width));
}

.pay-method-arrow {
  color: #000;
  font-size: calc(20 * 100vw / var(--nexa-design-width) / 2);
  line-height: 1;
}
</style>
