<script setup lang="ts">
// 达人申请说明页底部提交栏
// props.buttonText: 按钮文本
// props.disabled: 禁用状态
// emit.submit: 点击按钮
withDefaults(
  defineProps<{
    buttonText?: string;
    disabled?: boolean;
  }>(),
  {
    buttonText: '立即申请成为达人',
    disabled: false
  }
);

const emit = defineEmits<{
  (event: 'submit'): void;
}>();
</script>

<template>
  <footer class="guide-footer">
    <button type="button" class="guide-submit-btn" :disabled="disabled" @click="emit('submit')">
      {{ buttonText }}
    </button>
  </footer>
</template>

<style scoped>
.guide-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #feffff;
  border-top: 1px solid #e4e5e5;
  padding: calc(16 * 100vw / var(--nexa-design-width)) calc(15 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(max(16 * 100vw / var(--nexa-design-width), env(safe-area-inset-bottom)));
  z-index: 4;
}

.guide-submit-btn {
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

.guide-submit-btn:disabled {
  opacity: 0.65;
}
</style>
