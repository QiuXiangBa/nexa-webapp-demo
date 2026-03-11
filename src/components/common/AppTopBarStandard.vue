<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { NavBarRightAction } from '@/types/nav-bar';

// 标准二级页顶栏。
// props.title: 顶栏标题
// props.showBack: 是否显示返回按钮
// props.fallbackPath: 无历史栈时的兜底返回地址
// props.rightAction: 右侧操作位，当前未接业务时用占位保持标题居中
// emit.back: 点击返回时抛出
// emit.right-action: 点击右侧操作时抛出
const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    showBack?: boolean;
    fallbackPath?: string;
    rightAction?: NavBarRightAction;
    bordered?: boolean;
  }>(),
  {
    subtitle: '',
    showBack: true,
    fallbackPath: '',
    rightAction: 'none',
    bordered: false
  }
);

const emit = defineEmits<{
  (event: 'back'): void;
  (event: 'right-action'): void;
}>();

const router = useRouter();

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

const onRightAction = () => {
  emit('right-action');
};
</script>

<template>
  <header
    class="app-topbar-standard"
    :class="{
      'app-topbar-standard-bordered': props.bordered,
      'app-topbar-standard-rich': Boolean(props.subtitle)
    }"
  >
    <div class="topbar-standard-inner">
      <button v-if="props.showBack" type="button" class="topbar-side-btn topbar-back-btn" @click="onBack">
        <span class="topbar-back-icon" />
      </button>
      <div v-else class="topbar-side-btn topbar-side-placeholder" />

      <div class="topbar-title-wrap">
        <h1 class="topbar-title">{{ props.title }}</h1>
        <p v-if="props.subtitle" class="topbar-subtitle">{{ props.subtitle }}</p>
      </div>

      <button v-if="props.rightAction !== 'none'" type="button" class="topbar-side-btn topbar-right-btn" @click="onRightAction">
        <slot name="right" />
      </button>
      <div v-else class="topbar-side-btn topbar-side-placeholder" />
    </div>
  </header>
</template>

<style scoped>
.app-topbar-standard {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--nexa-z-overlay);
  width: 100%;
  height: calc(var(--nexa-topbar-total-height) + env(safe-area-inset-top));
  background: var(--nexa-color-surface-page);
}

.app-topbar-standard-rich {
  height: calc(var(--nexa-topbar-rich-total-height) + env(safe-area-inset-top));

}

.app-topbar-standard-bordered {
  border-bottom: 1px solid var(--nexa-color-border-soft);
}

.topbar-standard-inner {
  height: 100%;
  display: grid;
  grid-template-columns: var(--nexa-topbar-side-size) 1fr var(--nexa-topbar-side-size);
  align-items: center;
  padding: env(safe-area-inset-top) var(--nexa-topbar-horizontal-padding) 0;
}

.topbar-side-btn {
  width: var(--nexa-topbar-side-size);
  height: var(--nexa-topbar-side-size);
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.topbar-title-wrap {
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.topbar-title {
  margin: 0;
  color: var(--nexa-color-black);
  font-size: var(--nexa-topbar-title-size);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-subtitle {
  margin: var(--nexa-topbar-subtitle-gap) 0 0;
  color: var(--nexa-color-black);
  font-size: var(--nexa-topbar-subtitle-size);
  line-height: var(--nexa-topbar-subtitle-line-height);
  font-weight: 400;
}

.topbar-back-icon {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
  border-left: calc(2 * 100vw / var(--nexa-design-width)) solid var(--nexa-color-black);
  border-bottom: calc(2 * 100vw / var(--nexa-design-width)) solid var(--nexa-color-black);
  transform: rotate(45deg);
}

.app-topbar-standard-rich .topbar-side-btn {
  align-self: start;
  margin-top: calc(15 * 100vw / var(--nexa-design-width));
}
</style>
