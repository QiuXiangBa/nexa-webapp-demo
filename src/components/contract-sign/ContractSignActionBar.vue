<script setup lang="ts">
// 智能合约签署页底部动作栏
// props.loading: 签署提交中的加载态
// props.buttonText: 按钮文本
// emit.submit: 点击签署
withDefaults(
  defineProps<{
    loading?: boolean;
    buttonText?: string;
  }>(),
  {
    loading: false,
    buttonText: '同意并签署智能合约'
  }
);

const emit = defineEmits<{
  submit: [];
}>();
</script>

<template>
  <footer class="contract-sign-action-bar">
    <button type="button" class="sign-submit-btn" :disabled="loading" @click="emit('submit')">
      {{ loading ? '签署中...' : buttonText }}
    </button>
  </footer>
</template>

<style scoped>
.contract-sign-action-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: calc(8 * 100vw / var(--nexa-design-width)) calc(15 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  border-top: calc(1 * 100vw / var(--nexa-design-width)) solid #e4e5e5;
  background: #feffff;
}

.sign-submit-btn {
  width: 100%;
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: #3fbbfa;
  color: #fff;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  line-height: calc(40 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.sign-submit-btn:disabled {
  opacity: 0.72;
}
</style>
