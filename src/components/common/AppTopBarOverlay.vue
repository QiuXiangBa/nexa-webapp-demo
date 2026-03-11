<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { NavBarRightAction } from '@/types/nav-bar';

// 沉浸式详情页顶栏。
// props.collapsed: 滚动收起后的状态，当前先保留接口，后续交易详情/地图页接入时复用。
const props = withDefaults(
  defineProps<{
    title?: string;
    fallbackPath?: string;
    rightAction?: NavBarRightAction;
    collapsed?: boolean;
    heightPx?: number;
    useSafeArea?: boolean;
  }>(),
  {
    title: '',
    fallbackPath: '',
    rightAction: 'none',
    collapsed: false,
    heightPx: 70,
    useSafeArea: false
  }
);

const emit = defineEmits<{
  (event: 'back'): void;
  (event: 'right-action'): void;
}>();

const router = useRouter();

const rootClass = computed(() => ({
  'app-topbar-overlay-collapsed': props.collapsed
}));

const rootStyle = computed(() => ({
  '--app-topbar-overlay-height': props.useSafeArea
    ? `calc(${props.heightPx} * 100vw / var(--nexa-design-width) + env(safe-area-inset-top))`
    : `calc(${props.heightPx} * 100vw / var(--nexa-design-width))`
}));

const onBack = () => {
  emit('back');
  if (window.history.length > 1) {
    router.back();
    return;
  }
  if (props.fallbackPath) {
    void router.push(props.fallbackPath);
  }
};
</script>

<template>
  <header class="app-topbar-overlay" :class="rootClass" :style="rootStyle">
    <div class="overlay-background-layer">
      <slot name="background" />
    </div>

    <div class="topbar-overlay-inner">
      <div v-if="$slots.content" class="overlay-content-custom">
        <slot name="content" />
      </div>
      <template v-else>
        <button type="button" class="overlay-side-btn" @click="onBack">
          <span class="overlay-back-icon" />
        </button>

        <div class="overlay-title-wrap">
          <h1 class="overlay-title">{{ props.title }}</h1>
        </div>

        <button v-if="props.rightAction !== 'none'" type="button" class="overlay-side-btn" @click="emit('right-action')">
          <slot name="right" />
        </button>
        <div v-else class="overlay-side-btn overlay-side-placeholder" />
      </template>
    </div>
  </header>
</template>

<style scoped>
.app-topbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--nexa-z-overlay);
  width: 100%;
  height: var(--app-topbar-overlay-height);
  background: transparent;
  transition: background-color 0.2s ease, backdrop-filter 0.2s ease;
}

.overlay-background-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.app-topbar-overlay-collapsed {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--nexa-color-border-soft);
}

.topbar-overlay-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-columns: var(--nexa-topbar-side-size) 1fr var(--nexa-topbar-side-size);
  align-items: center;
  padding: 0 var(--nexa-topbar-horizontal-padding);
}

.overlay-content-custom {
  grid-column: 1 / -1;
  min-width: 0;
}

.overlay-side-btn {
  width: var(--nexa-topbar-side-size);
  height: var(--nexa-topbar-side-size);
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.overlay-title-wrap {
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-title {
  margin: 0;
  color: var(--nexa-color-black);
  font-size: var(--nexa-topbar-title-size);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.app-topbar-overlay-collapsed .overlay-title {
  opacity: 1;
}

.overlay-back-icon {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
  border-left: calc(2 * 100vw / var(--nexa-design-width)) solid var(--nexa-color-white);
  border-bottom: calc(2 * 100vw / var(--nexa-design-width)) solid var(--nexa-color-white);
  transform: rotate(45deg);
}

.app-topbar-overlay-collapsed .overlay-back-icon {
  border-left-color: var(--nexa-color-black);
  border-bottom-color: var(--nexa-color-black);
}
</style>
