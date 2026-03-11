<script setup lang="ts">
// 交易详情页主图区域
// props.heroImageUrl: 商品主图
// props.description: 商品说明文本
const props = defineProps<{
  heroImageUrl: string;
  description: string;
}>();
</script>

<template>
  <section class="trade-hero">
    <img class="trade-hero-image" :src="props.heroImageUrl" alt="商品主图" />

    <div class="hero-desc-mask">
      <p>{{ props.description }}</p>
    </div>
  </section>
</template>

<style scoped>
.trade-hero {
  position: relative;
  width: calc(390 * 100vw / var(--nexa-design-width));
  height: calc(520 * 100vw / var(--nexa-design-width));
  overflow: hidden;
}

.trade-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-desc-mask {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(71.24 * 100vw / var(--nexa-design-width));
  background: linear-gradient(90deg, rgba(150, 148, 174, 0.5) 0%, rgba(250, 250, 250, 0.5) 100%);
  backdrop-filter: blur(12px);
  padding: calc(6 * 100vw / var(--nexa-design-width)) calc(12 * 100vw / var(--nexa-design-width));
}

.hero-desc-mask p {
  margin: 0;
  color: #fff;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(18 * 100vw / var(--nexa-design-width));
}
</style>
