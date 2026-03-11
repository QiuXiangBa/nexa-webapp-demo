<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DEFAULT_BIZ_IMAGE_FALLBACK, getSafeBizImageSrc } from '@/utils/biz-image';

// 统一业务图片组件：
// - 对业务动态图片执行白名单校验
// - 对非法/失效图片自动回退到本地占位图
const props = withDefaults(defineProps<{
  src?: string | null;
  alt?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  round?: boolean;
  fallbackSrc?: string;
}>(), {
  alt: '',
  fit: 'cover'
});

const emit = defineEmits<{
  (event: 'error'): void;
}>();

const fallback = computed(() => props.fallbackSrc || DEFAULT_BIZ_IMAGE_FALLBACK);
const safeSrc = computed(() => getSafeBizImageSrc(props.src, fallback.value));
const renderSrc = ref<string>(safeSrc.value);

watch(safeSrc, (value) => {
  renderSrc.value = value;
});

const onError = () => {
  // 加载失败时兜底，保证布局稳定，避免 broken image 占位抖动。
  if (renderSrc.value !== fallback.value) {
    renderSrc.value = fallback.value;
  }
  emit('error');
};
</script>

<template>
  <van-image
    class="app-biz-image"
    :src="renderSrc"
    :alt="alt"
    :fit="fit"
    :width="width"
    :height="height"
    :radius="radius"
    :round="round"
    @error="onError"
  >
    <template #error>
      <img class="app-biz-image-fallback" :src="fallback" :alt="alt" />
    </template>
  </van-image>
</template>

<style scoped>
.app-biz-image {
  display: block;
  background: #eef2f6;
}

.app-biz-image-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>

