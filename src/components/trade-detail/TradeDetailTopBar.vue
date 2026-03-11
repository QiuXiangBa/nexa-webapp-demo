<script setup lang="ts">
import AppTopBarOverlay from '@/components/common/AppTopBarOverlay.vue';
import AppBizImage from '@/components/common/AppBizImage.vue';

// 交易详情页顶部栏
// props.sellerName: 卖家/店铺名称
// props.avatarUrl: 卖家头像
// props.backButtonUrl: 返回按钮图标
// emit.back: 点击返回
const props = defineProps<{
  sellerName: string;
  avatarUrl: string;
  backButtonUrl: string;
}>();

const emit = defineEmits<{
  (event: 'back'): void;
}>();
</script>

<template>
  <AppTopBarOverlay :height-px="52" use-safe-area fallback-path="/trade">
    <template #background>
      <div class="topbar-layer blur-base" />
      <div class="topbar-layer blur-blue" />
      <div class="topbar-layer blur-grad" />
    </template>

    <template #content>
      <div class="nav-row">
        <button type="button" class="back-btn" @click="emit('back')">
          <img :src="props.backButtonUrl" alt="返回" />
        </button>
        <AppBizImage class="seller-avatar" :src="props.avatarUrl" alt="卖家头像" fallback-src="/pages/common/avatar-fallback.svg" />
        <span class="seller-name">{{ props.sellerName }}</span>
      </div>
    </template>
  </AppTopBarOverlay>
</template>

<style scoped>
.topbar-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
}

.blur-base {
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
}

.blur-blue {
  height: calc(env(safe-area-inset-top) + calc(20 * 100vw / var(--nexa-design-width)));
  background: rgba(63, 187, 250, 0.3);
  backdrop-filter: blur(12px);
}

.blur-grad {
  height: 100%;
  background: linear-gradient(90deg, rgba(150, 148, 174, 0.5) 0%, rgba(250, 250, 250, 0.5) 100%);
  backdrop-filter: blur(12px);
}

.nav-row {
  height: 100%;
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  padding: env(safe-area-inset-top) calc(12 * 100vw / var(--nexa-design-width)) 0;
}

.back-btn {
  width: calc(31.2 * 100vw / var(--nexa-design-width));
  height: calc(31.2 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  padding: 0;
}

.back-btn img {
  width: 100%;
  height: 100%;
  display: block;
}

.seller-avatar {
  width: calc(20.8 * 100vw / var(--nexa-design-width));
  height: calc(20.8 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  border: 1px solid #fff;
}

.seller-avatar :deep(.van-image__img) {
  border-radius: 50%;
}

.seller-name {
  color: #593e13;
  font-size: calc(13 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}
</style>
