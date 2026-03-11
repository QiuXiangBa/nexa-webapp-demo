<script setup lang="ts">
import AppBizImage from '@/components/common/AppBizImage.vue';

// 商家明细头部组件
// props: 封面图、商家 logo、商家名称、发行时间、返回图标
// emit.back: 点击左上返回按钮
defineProps<{
  coverUrl: string;
  logoUrl: string;
  merchantName: string;
  issuedAt: string;
  backIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'back'): void;
}>();

const onBack = () => {
  emit('back');
};
</script>

<template>
  <section class="merchant-asset-header">
    <AppBizImage :src="coverUrl" alt="" fallback-src="/pages/common/image-fallback.svg" class="merchant-asset-cover" />

    <button type="button" class="merchant-back-btn" @click="onBack">
      <img :src="backIconUrl" alt="返回" />
    </button>

    <div class="merchant-meta-wrap">
      <AppBizImage :src="logoUrl" :alt="merchantName" fallback-src="/pages/common/logo-fallback.svg" class="merchant-logo" />
      <div class="merchant-meta-main">
        <p class="merchant-issued-at">发行时间：{{ issuedAt }}</p>
      </div>
    </div>
    <h1 class="merchant-name">{{ merchantName }}</h1>
  </section>
</template>

<style scoped>
.merchant-asset-header {
  position: relative;
  width: calc(390 * 100vw / var(--nexa-design-width));
  height: calc(300 * 100vw / var(--nexa-design-width));
}

/* 顶部封面图：使用 Figma 提供资源，保留底部圆角 */
.merchant-asset-cover {
  width: calc(390 * 100vw / var(--nexa-design-width));
  height: calc(219 * 100vw / var(--nexa-design-width));
  border-radius: 0 0 calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  display: block;
}

.merchant-asset-cover :deep(.van-image__img) {
  object-fit: cover;
  border-radius: 0 0 calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
}

.merchant-back-btn {
  position: absolute;
  left: calc(2 * 100vw / var(--nexa-design-width));
  top: calc(46 * 100vw / var(--nexa-design-width));
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  padding: 0;
  background: transparent;
}

.merchant-back-btn img {
  width: 100%;
  height: 100%;
  display: block;
}

.merchant-meta-wrap {
  position: absolute;
  left: calc(25 * 100vw / var(--nexa-design-width));
  top: calc(168 * 100vw / var(--nexa-design-width));
  right: calc(25 * 100vw / var(--nexa-design-width));
  height: calc(100 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(14 * 100vw / var(--nexa-design-width));
}

.merchant-logo {
  width: calc(100 * 100vw / var(--nexa-design-width));
  height: calc(100 * 100vw / var(--nexa-design-width));
  border-radius: calc(14 * 100vw / var(--nexa-design-width));
  border: 2px solid #fff;
  display: block;
}

.merchant-logo :deep(.van-image__img) {
  object-fit: cover;
  border-radius: calc(14 * 100vw / var(--nexa-design-width));
}

.merchant-meta-main {
  min-width: 0;
}

.merchant-issued-at {
  margin: calc(68 * 100vw / var(--nexa-design-width)) 0 0 0;
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 500;
}

.merchant-name {
  position: absolute;
  /* logo top(168) + logo height(100) + gap(10) = 278 */
  left: calc(25 * 100vw / var(--nexa-design-width));
  top: calc(280 * 100vw / var(--nexa-design-width));
  margin: 0 0 0 calc(15 * 100vw / var(--nexa-design-width));
  color: #0a81b4;
  font-size: calc(24 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
}
</style>
