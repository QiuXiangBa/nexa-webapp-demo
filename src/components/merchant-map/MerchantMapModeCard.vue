<script setup lang="ts">
import AppBizImage from '@/components/common/AppBizImage.vue';

// 地图模式底部列表卡片（白底行）
// props.model: 单个商家卡片数据（名称、距离、发行比例、Logo）
export interface MerchantMapModeCardModel {
  id: string;
  name: string;
  ratio: string;
  distance: string;
  logoUrl: string;
}

defineProps<{
  model: MerchantMapModeCardModel;
}>();
</script>

<template>
  <article class="merchant-list-card">
    <AppBizImage :src="model.logoUrl" :alt="model.name" fallback-src="/pages/common/logo-fallback.svg" class="merchant-list-card-logo" />
    <div class="merchant-list-card-main">
      <h4 class="merchant-list-card-name">{{ model.name }}</h4>
      <p class="merchant-list-card-ratio">数字资产发行比例：{{ model.ratio }}</p>
    </div>
    <div class="merchant-list-card-right">
      <span class="merchant-list-card-nav">
        <img src="/pages/merchant-map/39b71b30-af1e-47bd-bcd7-c7b32fd4e8d4.svg" alt="" />
      </span>
      <p class="merchant-list-card-distance">{{ model.distance }}</p>
    </div>
  </article>
</template>

<style scoped>
.merchant-list-card {
  width: calc(360 * 100vw / var(--nexa-design-width));
  height: calc(50 * 100vw / var(--nexa-design-width));
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  background: #fff;
  display: grid;
  grid-template-columns: calc(50 * 100vw / var(--nexa-design-width)) 1fr auto;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  padding: 0 calc(8 * 100vw / var(--nexa-design-width)) 0 0;
}

.merchant-list-card-logo {
  width: calc(50 * 100vw / var(--nexa-design-width));
  height: calc(50 * 100vw / var(--nexa-design-width));
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  display: block;
}

.merchant-list-card-logo :deep(.van-image__img) {
  object-fit: cover;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
}

.merchant-list-card-main {
  min-width: 0;
}

.merchant-list-card-name {
  margin: 0;
  color: #7e818d;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.merchant-list-card-ratio {
  margin: calc(6 * 100vw / var(--nexa-design-width)) 0 0;
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
}

.merchant-list-card-right {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.merchant-list-card-nav {
  width: calc(24 * 100vw / var(--nexa-design-width));
  height: calc(24 * 100vw / var(--nexa-design-width));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.merchant-list-card-nav img {
  width: 100%;
  height: 100%;
}

.merchant-list-card-distance {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #7e818d;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 400;
  white-space: nowrap;
}
</style>
