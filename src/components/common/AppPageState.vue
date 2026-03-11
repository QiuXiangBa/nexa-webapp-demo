<script setup lang="ts">
import { computed } from 'vue';

// 页面级全局状态组件
// 负责：统一 Loading / Empty / Error 的视觉和交互行为，避免每个页面重复实现
// props.state: 当前状态（ready/loading/empty/error）
// emit.retry: 错误态点击重试按钮时触发
export type AppPageStateType = 'ready' | 'loading' | 'empty' | 'error';

interface Props {
  state: AppPageStateType;
  loadingText?: string;
  loadingMode?: 'skeleton' | 'spinner';
  emptyDescription?: string;
  errorDescription?: string;
  retryText?: string;
  showRetry?: boolean;
  skeletonRows?: number;
  skeletonTitle?: boolean;
  skeletonAvatar?: boolean;
  minHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: '加载中...',
  loadingMode: 'skeleton',
  emptyDescription: '暂无数据',
  errorDescription: '加载失败，请稍后重试',
  retryText: '重试',
  showRetry: true,
  skeletonRows: 5,
  skeletonTitle: true,
  skeletonAvatar: false,
  minHeight: 180
});

const emit = defineEmits<{
  (event: 'retry'): void;
}>();

const isFeedbackState = computed(() => props.state !== 'ready');
const isSkeletonLoading = computed(() => props.state === 'loading' && props.loadingMode === 'skeleton');
const boxStyle = computed(() => ({
  // 状态组件属于业务反馈层，最小高度按宽度轴缩放，避免空态/错误态在长屏设备被纵向放大。
  '--app-page-state-min-height': `calc(${props.minHeight} * 100vw / var(--nexa-design-width))`
}));
</script>

<template>
  <div
    class="app-page-state"
    :class="{
      'app-page-state-feedback': isFeedbackState,
      'app-page-state-skeleton': isSkeletonLoading
    }"
    :style="boxStyle"
  >
    <Transition name="app-page-state-fade" mode="out-in">
      <div v-if="state === 'loading'" key="loading" class="app-page-state-inner">
        <slot name="loading">
          <van-skeleton
            v-if="loadingMode === 'skeleton'"
            class="app-page-state-skeleton-inner"
            :row="skeletonRows"
            :title="skeletonTitle"
            :avatar="skeletonAvatar"
            :loading="true"
          />
          <div v-else class="app-page-state-spinner">
            <van-loading size="24px" vertical>{{ loadingText }}</van-loading>
          </div>
        </slot>
      </div>

      <div v-else-if="state === 'error'" key="error" class="app-page-state-inner">
        <slot name="error">
          <van-empty image="error" :description="errorDescription">
            <template #bottom>
              <van-button v-if="showRetry" type="primary" size="small" @click="emit('retry')">{{ retryText }}</van-button>
            </template>
          </van-empty>
        </slot>
      </div>

      <div v-else-if="state === 'empty'" key="empty" class="app-page-state-inner">
        <slot name="empty">
          <van-empty :description="emptyDescription" />
        </slot>
      </div>

      <div v-else key="ready" class="app-page-state-inner">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-page-state {
  width: 100%;
}

/* 反馈态使用统一最小高度，保证 loading/empty/error 不会把页面撑塌或跳动。 */
.app-page-state-feedback {
  min-height: var(--app-page-state-min-height);
  padding: calc(12 * 100vw / var(--nexa-design-width)) 0;
}

/* loading 骨架态保持顶部对齐，适配列表/卡片类场景。 */
.app-page-state-skeleton {
  display: block;
}

.app-page-state-feedback:not(.app-page-state-skeleton) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-page-state-skeleton-inner {
  width: 100%;
}

.app-page-state-spinner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-page-state-inner {
  width: 100%;
}

.app-page-state-fade-enter-active,
.app-page-state-fade-leave-active {
  transition: opacity 0.2s ease;
}

.app-page-state-fade-enter-from,
.app-page-state-fade-leave-to {
  opacity: 0;
}
</style>
