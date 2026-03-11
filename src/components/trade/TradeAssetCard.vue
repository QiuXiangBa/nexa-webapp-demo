<script setup lang="ts">
import AppBizImage from '@/components/common/AppBizImage.vue';
import authIcon from '@/assets/icons/pages/trade/auth.svg';
import favoriteIcon from '@/assets/icons/pages/trade/star-active.svg';
import normalIcon from '@/assets/icons/pages/trade/star-outline.svg';

export interface TradeAssetCardModel {
  id: string;
  cover: string;
  avatar: string;
  name: string;
  mode: string;
  price: string;
  favorite: boolean;
}

// 交易资产卡片
// props.model: 单卡展示数据（封面、头像、名称、模式、价格、收藏态）
defineProps<{
  model: TradeAssetCardModel;
}>();

const emit = defineEmits<{
  (e: 'click', id: string): void;
  (e: 'toggle-favorite', id: string): void;
}>();

</script>

<template>
  <article class="trade-asset-card" role="button" tabindex="0" @click="emit('click', model.id)">
    <div class="trade-asset-cover-wrap">
      <AppBizImage :src="model.cover" :alt="model.name" fallback-src="/pages/common/image-fallback.svg" class="trade-asset-cover" />
      <button
        type="button"
        class="trade-asset-star-btn"
        aria-label="收藏"
        @click.stop="emit('toggle-favorite', model.id)"
      >
        <img :src="model.favorite ? favoriteIcon : normalIcon" alt="收藏" class="trade-asset-star" />
      </button>
    </div>
    <div class="trade-asset-meta">
      <AppBizImage :src="model.avatar" :alt="model.name" fallback-src="/pages/common/avatar-fallback.svg" class="trade-asset-avatar" />
      <span class="trade-asset-name">{{ model.name }}</span>
      <img :src="authIcon" alt="认证" class="trade-asset-auth-icon" />
    </div>
    <p class="trade-asset-info">{{ model.mode }}　价格：{{ model.price }}</p>
  </article>
</template>

<style scoped>
.trade-asset-card {
  /* 单卡主容器：144x180 双列单元，圆角与背景按设计稿还原 */
  width: calc(144 * 100vw / var(--nexa-design-width));
  height: calc(180 * 100vw / var(--nexa-design-width));
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  overflow: hidden;
  background: #f3f5fa;
  border: 0;
  text-align: left;
  padding: 0;
  cursor: pointer;
}

.trade-asset-cover-wrap {
  width: 100%;
  height: calc(120 * 100vw / var(--nexa-design-width));
  position: relative;
  z-index: 1;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  overflow: hidden;
}

.trade-asset-cover {
  width: 100%;
  height: 100%;
  display: block;
}

.trade-asset-cover :deep(.van-image__img) {
  object-fit: cover;
}

.trade-asset-star {
  width: calc(14 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.trade-asset-star-btn {
  position: absolute;
  right: calc(6 * 100vw / var(--nexa-design-width));
  bottom: calc(6 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  padding: 0;
  line-height: 0;
}

.trade-asset-meta {
  margin-top: calc(-4 * 100vw / var(--nexa-design-width));
  padding: 0 calc(6 * 100vw / var(--nexa-design-width)) 0 calc(4 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(6 * 100vw / var(--nexa-design-width));
  position: relative;
  z-index: 2;
}

.trade-asset-avatar {
  width: calc(30 * 100vw / var(--nexa-design-width));
  height: calc(30 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  border: calc(1.4 * 100vw / var(--nexa-design-width)) solid #f9faff;
  background: #fff;
}

.trade-asset-avatar :deep(.van-image__img) {
  object-fit: cover;
  border-radius: 50%;
}

.trade-asset-name {
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  color: #000;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trade-asset-auth-icon {
  width: calc(12.5 * 100vw / var(--nexa-design-width));
  height: calc(12.5 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  object-fit: contain;
}

.trade-asset-info {
  margin: calc(8 * 100vw / var(--nexa-design-width)) 0 0;
  padding: 0 calc(8 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  color: #7e818d;
  line-height: 1.2;
}
</style>
