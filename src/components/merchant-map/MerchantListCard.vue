<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppBizImage from '@/components/common/AppBizImage.vue';

// 商家地图列表卡片
// props.model: 单个商家卡片数据（名称、距离、发行比例、Logo）
export interface MerchantListCardModel {
  id: string;
  name: string;
  ratio: string;
  distance: string;
  logoUrl: string;
}

const props = defineProps<{
  model: MerchantListCardModel;
}>();

const router = useRouter();

const goDetail = () => {
  router
    .push({
      path: '/merchant-map/detail',
      query: {
        merchantId: props.model.id,
        merchantName: props.model.name,
        logoUrl: props.model.logoUrl,
        issuedAt: '2025年12月'
      }
    })
    .catch(() => undefined);
};
</script>

<template>
  <article class="merchant-list-card" @click="goDetail">
    <AppBizImage :src="model.logoUrl" :alt="model.name" fallback-src="/pages/common/logo-fallback.svg" class="merchant-list-card-logo" />
    <div class="merchant-list-card-main">
      <h4 class="merchant-list-card-name">{{ model.name }}</h4>
      <p class="merchant-list-card-ratio">数字资产发行比例：{{ model.ratio }}</p>
    </div>
    <p class="merchant-list-card-distance">{{ model.distance }}</p>
  </article>
</template>

<style scoped>
.merchant-list-card {
  /* 卡片样式对齐 Figma：60 高、10 圆角、蓝色纵向渐变 */
  width: calc(340 * 100vw / var(--nexa-design-width));
  height: calc(60 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0a82b5 100%);
  display: grid;
  grid-template-columns: calc(50 * 100vw / var(--nexa-design-width)) 1fr auto;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
  padding: 0 calc(14 * 100vw / var(--nexa-design-width)) 0 calc(6 * 100vw / var(--nexa-design-width));
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
  color: #fff;
  font-size: calc(32 / 3 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.merchant-list-card-ratio {
  margin: calc(4 * 100vw / var(--nexa-design-width)) 0 0;
  color: #fff;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
  opacity: 0.95;
}

.merchant-list-card-distance {
  margin: 0;
  color: #fff;
  font-size: calc(28 / 3 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}
</style>
