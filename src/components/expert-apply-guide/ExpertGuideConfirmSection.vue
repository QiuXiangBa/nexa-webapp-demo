<script setup lang="ts">
export interface ExpertGuideConfirmItem {
  key: string;
  label: string;
  checked: boolean;
}

// 达人申请说明确认勾选区
// props.items: 勾选项
// props.checkIconUrl: 选中时打勾图标
// emit.toggle: 点击勾选项时切换状态
const props = defineProps<{
  items: ExpertGuideConfirmItem[];
  checkIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'toggle', key: string): void;
}>();
</script>

<template>
  <section class="confirm-section">
    <h2>权益 &amp; 责任确认勾选：</h2>

    <div class="confirm-section-info">
      <button v-for="item in props.items" :key="item.key" type="button" class="confirm-row" @click="emit('toggle', item.key)">
      <span class="check-box" :class="{ checked: item.checked }">
        <img v-if="item.checked" :src="props.checkIconUrl" alt="" />
      </span>
      <span class="label">{{ item.label }}</span>
    </button>
    </div>


  </section>
</template>

<style scoped>
.confirm-section {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  padding: calc(36 * 100vw / var(--nexa-design-width)) calc(18 * 100vw / var(--nexa-design-width)) 0;
}
.confirm-section-info{
  padding-left: calc(16 * 100vw / var(--nexa-design-width));
  padding-right: calc(16 * 100vw / var(--nexa-design-width));
}

.confirm-section h2 {
  margin: 0;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.confirm-row {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
  text-align: left;
}

.check-box {
  width: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(12 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
  border: 1px solid #1890c9;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.check-box img {
  width: calc(8 * 100vw / var(--nexa-design-width));
  height: calc(6 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.label {
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(20.8 * 100vw / var(--nexa-design-width));
}
</style>
