<script setup lang="ts">
// 商家资料填写页底部提交栏
// props.buttonText: 按钮文案
// props.loading: 提交中状态
// emit.submit: 点击提交材料
withDefaults(
  defineProps<{
    buttonText?: string;
    loading?: boolean;
  }>(),
  {
    buttonText: '提交材料',
    loading: false
  }
);

const emit = defineEmits<{
  (event: 'submit'): void;
}>();
</script>

<template>
  <footer class="profile-submit-footer">
    <button type="button" class="profile-submit-btn" :disabled="loading" data-testid="merchant-apply-submit" @click="emit('submit')">
      {{ loading ? '提交中...' : buttonText }}
    </button>
  </footer>
</template>

<style scoped>
.profile-submit-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e4e5e5;
  background: #feffff;
  padding: calc(16 * 100vw / var(--nexa-design-width)) calc(15 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(max(16 * 100vw / var(--nexa-design-width), env(safe-area-inset-bottom)));
  z-index: 4;
}

.profile-submit-btn {
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

.profile-submit-btn:disabled {
  opacity: 0.7;
}
</style>
