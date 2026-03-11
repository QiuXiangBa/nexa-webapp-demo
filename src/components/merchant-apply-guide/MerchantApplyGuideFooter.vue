<script setup lang="ts">
// 商家申请说明页底部操作栏
// emit.start: 点击开始申请
defineProps<{
  buttonText: string;
}>();

const emit = defineEmits<{
  (event: 'start'): void;
}>();
</script>

<template>
  <footer class="guide-footer">
    <button type="button" class="guide-start-btn" @click="emit('start')">{{ buttonText }}</button>
  </footer>
</template>

<style scoped>
.guide-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 3;
  width: 100%;
  background: #feffff;
  border-top: 1px solid #e4e5e5;
  padding: calc(16 * 100vw / var(--nexa-design-width)) calc(15 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(max(16 * 100vw / var(--nexa-design-width), env(safe-area-inset-bottom)));
}

.guide-start-btn {
  width: calc(360 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(100 * 100vw / var(--nexa-design-width));
  background: #3fbbfa;
  color: #fff;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  line-height: calc(40 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  padding: 0;
}
</style>
