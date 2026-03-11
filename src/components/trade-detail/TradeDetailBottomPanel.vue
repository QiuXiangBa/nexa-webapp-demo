<script setup lang="ts">
import AppBizImage from '@/components/common/AppBizImage.vue';

// 交易详情页底部交易面板
// props: 缩略图/价格/标题/收藏态与图标资源
// emit.consult/favorite/pre-trade/buy-now: 底部按钮动作
const props = defineProps<{
  thumbUrl: string;
  priceText: string;
  titleText: string;
  favorite: boolean;
  favoriteIconUrl: string;
  cartIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'consult'): void;
  (event: 'favorite'): void;
  (event: 'pre-trade'): void;
  (event: 'buy-now'): void;
}>();
</script>

<template>
  <section class="trade-bottom-panel">
    <div class="asset-meta-row">
      <AppBizImage class="asset-thumb" :src="props.thumbUrl" alt="商品缩略图" fallback-src="/pages/common/image-fallback.svg" />
      <div class="asset-meta-main">
        <p class="asset-price">{{ props.priceText }}</p>
        <p class="asset-title">{{ props.titleText }}</p>
      </div>
    </div>

    <div class="trade-actions-row">
      <button type="button" class="icon-action" @click="emit('consult')">
        <span class="consult-icon" />
        <span>咨询</span>
      </button>

      <button type="button" class="icon-action" @click="emit('favorite')">
        <img class="icon-star" :src="props.favoriteIconUrl" alt="" :class="{ active: props.favorite }" />
        <span>收藏</span>
      </button>

      <button type="button" class="cta-btn pre-trade" @click="emit('pre-trade')">
        <img class="cart-icon" :src="props.cartIconUrl" alt="" />
        <span>预交易</span>
      </button>

      <button type="button" class="cta-btn buy-now" @click="emit('buy-now')">立即购买</button>
    </div>
  </section>
</template>

<style scoped>
.trade-bottom-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: var(--nexa-z-overlay, 100);
  background: #f9faff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: calc(12 * 100vw / var(--nexa-design-width)) calc(15 * 100vw / var(--nexa-design-width)) calc(max(16 * 100vw / var(--nexa-design-width), env(safe-area-inset-bottom)));
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}

.asset-meta-row {
  display: flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.asset-thumb {
  width: calc(52 * 100vw / var(--nexa-design-width));
  height: calc(52 * 100vw / var(--nexa-design-width));
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
}

.asset-thumb :deep(.van-image__img) {
  object-fit: cover;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
}

.asset-meta-main {
  min-width: 0;
}

.asset-price {
  margin: 0;
  color: #7e818d;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  line-height: calc(24 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.asset-title {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #7e818d;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(16 * 100vw / var(--nexa-design-width));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trade-actions-row {
  margin-top: calc(18 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: calc(30 * 100vw / var(--nexa-design-width)) calc(30 * 100vw / var(--nexa-design-width)) calc(111.28 * 100vw / var(--nexa-design-width)) calc(111.28 * 100vw / var(--nexa-design-width));
  align-items: center;
  justify-content: space-between;
  column-gap: calc(8 * 100vw / var(--nexa-design-width));
}

.icon-action {
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(2 * 100vw / var(--nexa-design-width));
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
}

.consult-icon {
  width: calc(18 * 100vw / var(--nexa-design-width));
  height: calc(18 * 100vw / var(--nexa-design-width));
  border: 1px solid #7e818d;
  border-radius: 50% 50% 50% 0;
}

.icon-star {
  width: calc(18 * 100vw / var(--nexa-design-width));
  height: calc(18 * 100vw / var(--nexa-design-width));
  opacity: 0.6;
}

.icon-star.active {
  opacity: 1;
}

.cta-btn {
  height: calc(42.64 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  color: #fff;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  line-height: calc(42.64 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  padding: 0;
}

.pre-trade {
  background: #fdcc00;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.cart-icon {
  width: calc(20.8 * 100vw / var(--nexa-design-width));
  height: calc(17.68 * 100vw / var(--nexa-design-width));
}

.buy-now {
  background: #3fbbfa;
}
</style>
