<script setup lang="ts">
// 自定义渐变头部基座。
// props.title: 主标题
// props.subtitle: 副标题，可选
// props.backIconUrl: 返回图标资源
// props.badgeIconUrl: 右下挂签装饰，可选
// props.titleSizePx: 标题字号，按设计稿像素传入
// props.subtitleMarginTopPx: 副标题与标题间距
// emit.back: 点击返回
const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    backIconUrl: string;
    badgeIconUrl?: string;
    titleSizePx?: number;
    subtitleMarginTopPx?: number;
  }>(),
  {
    subtitle: '',
    badgeIconUrl: '',
    titleSizePx: 24,
    subtitleMarginTopPx: 4
  }
);

const emit = defineEmits<{
  (event: 'back'): void;
}>();
</script>

<template>
  <header class="hero-header">
    <button type="button" class="hero-back-btn" @click="emit('back')">
      <img :src="props.backIconUrl" alt="返回" />
    </button>

    <h1 class="hero-title" :style="{ '--hero-title-size': `calc(${props.titleSizePx} * 100vw / var(--nexa-design-width))` }">
      {{ props.title }}
    </h1>

    <p
      v-if="props.subtitle"
      class="hero-subtitle"
      :style="{ '--hero-subtitle-gap': `calc(${props.subtitleMarginTopPx} * 100vw / var(--nexa-design-width))` }"
    >
      {{ props.subtitle }}
    </p>

    <img v-if="props.badgeIconUrl" :src="props.badgeIconUrl" alt="" class="hero-badge" />
  </header>
</template>

<style scoped>
.hero-header {
  width: calc(390 * 100vw / var(--nexa-design-width));
  height: calc(219 * 100vw / var(--nexa-design-width));
  padding-top: calc(71 * 100vw / var(--nexa-design-width));
  background: linear-gradient(160deg, #10c0f3 0%, #0174af 70.059%);
  border-bottom-left-radius: calc(20 * 100vw / var(--nexa-design-width));
  border-bottom-right-radius: calc(20 * 100vw / var(--nexa-design-width));
  position: relative;
}

.hero-back-btn {
  position: absolute;
  left: calc(8 * 100vw / var(--nexa-design-width));
  top: calc(43 * 100vw / var(--nexa-design-width));
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  padding: 0;
  background: transparent;
}

.hero-back-btn img {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-title {
  margin: 0;
  text-align: center;
  color: #fff;
  font-size: var(--hero-title-size);
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.hero-subtitle {
  margin: var(--hero-subtitle-gap) 0 0;
  text-align: center;
  color: #fff;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 300;
}

.hero-badge {
  position: absolute;
  right: calc(10 * 100vw / var(--nexa-design-width));
  bottom: calc(-30 * 100vw / var(--nexa-design-width));
  width: calc(96.924 * 100vw / var(--nexa-design-width));
  height: calc(105 * 100vw / var(--nexa-design-width));
  pointer-events: none;
  z-index: 3;
}
</style>
