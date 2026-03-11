<script setup lang="ts">
export interface ExpertOptionItem {
  key: string;
  label: string;
  checked: boolean;
}

// 推广类型选择卡
// props.items: 可多选项
// props.checkIconUrl: 勾选图标
// emit.toggle: 切换选项
const props = defineProps<{
  items: ExpertOptionItem[];
  checkIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'toggle', key: string): void;
}>();
</script>

<template>
  <section class="promotion-section">
    <p class="section-label">推广类型选择</p>

    <div class="promotion-card">
      <div class="question-row">你更擅长哪种方式？（可多选）</div>

      <button v-for="(item, index) in props.items" :key="item.key" type="button" class="option-row" :class="{ 'row-last': index === props.items.length - 1 }" @click="emit('toggle', item.key)">
        <span class="option-label">{{ item.label }}</span>
        <span class="check-box" :class="{ checked: item.checked }">
          <img v-if="item.checked" :src="props.checkIconUrl" alt="" />
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.promotion-section {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
}

.section-label {
  margin: 0 0 calc(6 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}

.promotion-card {
  width: calc(307 * 100vw / var(--nexa-design-width));
  height: calc(270 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  overflow: hidden;
}

.question-row {
  width: calc(272.48 * 100vw / var(--nexa-design-width));
  height: calc(54.08 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  color: #363636;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: calc(54.08 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.option-row {
  width: calc(272.48 * 100vw / var(--nexa-design-width));
  height: calc(54.08 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border: 0;
  border-bottom: 1px solid #eee;
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}

.option-row.row-last {
  border-bottom: 0;
}

.option-label {
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(54.08 * 100vw / var(--nexa-design-width));
}

.check-box {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
  border: 1px solid #667cf9;
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.check-box img {
  width: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}
</style>
