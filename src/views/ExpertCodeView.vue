<script setup lang="ts">
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';

// 达人码页（Figma node: 54:3099）
// 负责：展示达人授权二维码与今日授权记录入口
// 不负责：扫码授权业务逻辑（当前为 UI 还原阶段）
const qrCodeUrl = '/pages/expert-code/26d0ba93-44e0-43d5-907e-2130e63ee869.png';
const recordIconUrl = '/pages/expert-code/f60521a2-82b0-4891-857a-9d274a5438d4.svg';
</script>

<template>
  <div class="expert-code-page">
    <AppTopBarStandard title="达人授权码" fallback-path="/me" />

    <section class="expert-intro">
      <p>
        用于确认达人推荐关系或商家发行归属<br />
        平台不会通过扫码直接发放任何资产
      </p>
    </section>

    <section class="expert-card">
      <div class="card-title">达人授权码</div>
      <div class="divider" />
      <div class="nickname">达人昵称</div>

      <div class="qr-wrap">
        <img :src="qrCodeUrl" alt="" class="qr-img" />
<!--        <span class="qr-avatar-wrap">-->
<!--          <img :src="avatarUrl" alt="" class="qr-avatar" />-->
<!--        </span>-->
      </div>

      <button type="button" class="record-row">
        <img :src="recordIconUrl" alt="" class="record-icon" />
        <span class="record-text">今日授权记录</span>
        <span class="record-arrow">〉</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.expert-code-page {
  min-height: 100dvh;
  background: #f9faff;
  padding-top: calc(70 * 100vw / var(--nexa-design-width));
}

.expert-intro {
  margin-top: calc(18 * 100vw / var(--nexa-design-width));
  display: flex;
  justify-content: center;
}

.expert-intro p {
  margin: 0;
  color: #b3b3b3;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(14 * 100vw / var(--nexa-design-width));
  text-align: center;
}

.expert-card {
  width: calc(366 * 100vw / var(--nexa-design-width));
  height: calc(382 * 100vw / var(--nexa-design-width));
  margin: calc(18 * 100vw / var(--nexa-design-width)) auto 0;
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  padding: 0 calc(23 * 100vw / var(--nexa-design-width));
}

.card-title {
  height: calc(60 * 100vw / var(--nexa-design-width));
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(60 * 100vw / var(--nexa-design-width));
}

.divider {
  height: 1px;
  background: #ececec;
}

.nickname {
  margin-top: calc(22 * 100vw / var(--nexa-design-width));
  color: #000;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  text-align: center;
}

.qr-wrap {
  margin: calc(16 * 100vw / var(--nexa-design-width)) auto 0;
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

.record-row {
  margin-top: calc(26 * 100vw / var(--nexa-design-width));
  width: calc(320 * 100vw / var(--nexa-design-width));
  height: calc(60 * 100vw / var(--nexa-design-width));
  border: 0;
  border-top: 1px solid #ececec;
  background: #fff;
  display: grid;
  grid-template-columns: calc(16 * 100vw / var(--nexa-design-width)) 1fr auto;
  align-items: center;
  column-gap: calc(12 * 100vw / var(--nexa-design-width));
  padding: 0 calc(6 * 100vw / var(--nexa-design-width));
}

.record-icon {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
}

.record-text {
  text-align: left;
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
}

.record-arrow {
  color: #8a6a43;
  font-size: calc(20 * 100vw / var(--nexa-design-width) / 2);
}
</style>
