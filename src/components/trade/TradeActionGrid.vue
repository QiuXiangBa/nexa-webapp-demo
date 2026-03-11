<script setup lang="ts">
export interface TradeActionItem {
  key: string;
  label: string;
  iconUrl?: string;
  iconText?: string;
}

// 功能入口五宫格
// props.items: 入口列表，优先使用 iconUrl；缺失时回退 iconText
defineProps<{
  items: TradeActionItem[];
}>();
</script>

<template>
  <div class="trade-actions">
    <button v-for="item in items" :key="item.key" type="button" class="trade-action-btn">
      <span class="trade-action-icon">
        <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.label" class="trade-action-icon-img" />
        <span v-else class="trade-action-icon-fallback">{{ item.iconText }}</span>
        <span class="trade-action-label">{{ item.label }}</span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.trade-actions {
  /* 五宫格布局：每列 50 宽，和设计稿入口区一一对应 */
  display: grid;
  grid-template-columns: repeat(5, calc(50 * 100vw / var(--nexa-design-width)));
  justify-content: space-between;
  gap: calc(6 * 100vw / var(--nexa-design-width));
}

.trade-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  border: 0;
  background: transparent;
  padding: 0;
}

.trade-action-icon {
  width: calc(34 * 100vw / var(--nexa-design-width));
  height: calc(34 * 100vw / var(--nexa-design-width));
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  background: #3fbbfa;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: calc(3 * 100vw / var(--nexa-design-width))
}

.trade-action-icon-img {
  margin-top: calc(3 * 100vw / var(--nexa-design-width));
  width: calc(18 * 100vw / var(--nexa-design-width));
  height: calc(18 * 100vw / var(--nexa-design-width));
  object-fit: contain;
  display: block;
}

.trade-action-icon-fallback {
  color: #fff;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1;
}

.trade-action-label {
  position: absolute;
  left: 50%;
  bottom: calc(1 * 100vw / var(--nexa-design-width));
  transform: translateX(-50%);
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1;
  color: #ffffff;
  min-width: calc(34 * 100vw / var(--nexa-design-width));
  padding: 0;
  text-align: center;
  font-weight: 700;
}
</style>
