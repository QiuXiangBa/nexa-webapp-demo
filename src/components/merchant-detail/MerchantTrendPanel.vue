<script setup lang="ts">
import { computed } from 'vue';
import TrendChartCard from '@/components/common/TrendChartCard.vue';

// 商家明细趋势图模块
// props: 日期标签、当前模式、趋势点列表
// emit.change-mode: 切换“价值/数量”模式
interface TrendPoint {
  dayLabel: string;
  value: number;
  amount: number;
}

const props = defineProps<{
  dateLabel: string;
  mode: 'value' | 'amount';
  points: TrendPoint[];
}>();

const emit = defineEmits<{
  (event: 'change-mode', value: 'value' | 'amount'): void;
}>();

const chartPoints = computed(() =>
  props.points.map((item) => ({
    date: item.dayLabel,
    value: props.mode === 'value' ? item.value : item.amount
  }))
);

const setMode = (value: 'value' | 'amount') => {
  emit('change-mode', value);
};
</script>

<template>
  <section class="merchant-trend-panel">
    <div class="section-header">
      <h2 class="section-title">数字资产趋势图</h2>
      <div class="mode-pills">
        <button type="button" class="mode-pill" :class="{ active: mode === 'value' }" @click="setMode('value')">价值</button>
        <button type="button" class="mode-pill" :class="{ active: mode === 'amount' }" @click="setMode('amount')">数量</button>
      </div>
    </div>

    <div class="trend-card-wrap">
      <TrendChartCard :month-label="dateLabel" :points="chartPoints" />
    </div>
  </section>
</template>

<style scoped>
.merchant-trend-panel {
  width: calc(320 * 100vw / var(--nexa-design-width));
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: calc(6 * 100vw / var(--nexa-design-width));
}

.section-title {
  margin: 0;
  color: #7e818d;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.trend-card-wrap {
  margin-top: 0;
}

.mode-pills {
  display: inline-flex;
  align-items: center;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  overflow: hidden;
  background: #e8f4fb;
  padding: calc(2 * 100vw / var(--nexa-design-width));
  gap: calc(2 * 100vw / var(--nexa-design-width));
}

.mode-pill {
  min-width: calc(35 * 100vw / var(--nexa-design-width));
  height: calc(18 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(4 * 100vw / var(--nexa-design-width));
  background: transparent;
  color: #7e818d;
  font-size: calc(9 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 600;
  padding: 0 calc(6 * 100vw / var(--nexa-design-width));
  transition: background 0.15s, color 0.15s;
}

.mode-pill.active {
  color: #fff;
  background: #3fbbfa;
}
</style>
