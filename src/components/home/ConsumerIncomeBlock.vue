<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { message } from '@/utils/message';
import type { SwipeInstance } from 'vant';
import TrendSwitchTabs from '@/components/common/TrendSwitchTabs.vue';
import TrendChartCard from '@/components/common/TrendChartCard.vue';
import DistributionSwitchTabs from '@/components/common/DistributionSwitchTabs.vue';
import DistributionPieLegend from '@/components/common/DistributionPieLegend.vue';
import ZSpaceIncomeList from '@/components/home/ZSpaceIncomeList.vue';

interface TrendPoint {
  date: string;
  value: number | string;
}

interface DistItem {
  name: string;
  value: string;
  percent: number;
  color: string;
}

// 消费收益区组件（Figma node: 31:2169）
// 负责：消费收益总卡片 + 商家收益列表 + 趋势/分布切换
// 不负责：页面标题、系统通知、收益类型主 tab
const props = withDefaults(
  defineProps<{
    amount: string;
    unit?: string;

    trendPoints?: TrendPoint[];
    trendLoading?: boolean;
    distOptions?: string[];
    distItems?: DistItem[];
    distLoading?: boolean;
    listRows?: Array<{ logo?: string; merchantName: string; time: string; amount: string; amountIcon?: string }>;
  }>(),
  {
    unit: '诺',

    trendPoints: () => [
      { date: '4', value: 28 },
      { date: '5', value: 40 },
      { date: '6', value: 42 },
      { date: '7', value: 62 },
      { date: '8', value: 67 },
      { date: '9', value: 72 },
      { date: '10', value: 86 }
    ],
    trendLoading: false,
    distLoading: false,
    distOptions: () => ['消费类型', '消费地区'],
    distItems: () => [
      { name: '饮食', value: '1000诺', percent: 52, color: '#1677ff' },
      { name: '娱乐', value: '600诺', percent: 18, color: '#45b7ff' },
      { name: '交通', value: '400诺', percent: 28, color: '#d9dee8' }
    ],
    listRows: () => [
      { merchantName: '外婆家', time: '2026-02-10 03:13:10', amount: '0.5诺' },
      { merchantName: '7-11', time: '2026-02-10 03:13:10', amount: '0.5诺' },
      { merchantName: '麦当劳', time: '2026-02-10 03:13:10', amount: '0.5诺' },
      { merchantName: '星巴克', time: '2026-02-10 03:13:10', amount: '0.5诺' },
      { merchantName: '肯德基', time: '2026-02-10 03:13:10', amount: '0.5诺' },
      { merchantName: '必胜客', time: '2026-02-10 03:13:10', amount: '0.5诺' }
    ]
  }
);

const emit = defineEmits<{
  (e: 'period-change', period: 7 | 30 | 90): void;
  (e: 'dist-change', tab: string): void;
}>();

const TREND_OPTIONS = ['7日趋势', '30日趋势', '90日趋势'] as const;
const trendPeriodMap: Record<string, 7 | 30 | 90> = { '7日趋势': 7, '30日趋势': 30, '90日趋势': 90 };

const trendTab = ref<string>('7日趋势');
const distTab = ref(props.distOptions[0] || '消费类型');

const trendIndex = computed(() => TREND_OPTIONS.indexOf(trendTab.value as typeof TREND_OPTIONS[number]));

const onTrendTabChange = (val: string) => {
  trendTab.value = val;
  const period = trendPeriodMap[val];
  if (period) emit('period-change', period);
};

const prevTrend = () => {
  if (trendIndex.value > 0) onTrendTabChange(TREND_OPTIONS[trendIndex.value - 1]);
};
const nextTrend = () => {
  if (trendIndex.value < TREND_OPTIONS.length - 1) onTrendTabChange(TREND_OPTIONS[trendIndex.value + 1]);
};

const onDistTabChange = (val: string) => {
  distTab.value = val;
  emit('dist-change', val);
};
const chartMode = ref<'trend' | 'distribution'>('trend');
const incomeExpanded = ref(false);
const swipeRef = ref<SwipeInstance>();

watch(chartMode, (val) => {
  nextTick(() => {
    swipeRef.value?.swipeTo(val === 'trend' ? 0 : 1);
  });
});

const onSwipeChange = (index: number) => {
  chartMode.value = index === 0 ? 'trend' : 'distribution';
};

const toggleExpand = () => {
  incomeExpanded.value = !incomeExpanded.value;
};

const goDetail = () => {
  message.info('功能建设中');
};
</script>

<template>
  <!-- 首页收益区组件（Figma node: 31:2169）
    负责：收益总卡片 + 商家收益列表 + 趋势/分布切换
    不负责：页面标题、系统通知、收益类型主 tab -->
  <section class="income-block">
    <div class="income-block-body">
      <button class="card-arrow card-arrow--prev" aria-label="上一项">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M7 1L1 7L7 13" stroke="#2EB8CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="income-card-wrap">
        <div class="income-card">
          <div class="income-card-top">
            <div class="income-title">消费总收益</div>
            <button class="income-detail-btn" @click="goDetail">查看详情 &gt;</button>
            <div class="amount-row">
              <span class="amount">{{ amount }}</span>
              <span class="unit">{{ unit }}</span>
            </div>
          </div>
          <div class="income-card-body" :class="{ collapsed: !incomeExpanded }">
            <ZSpaceIncomeList :rows="listRows" type="consumer" />
          </div>
          <button class="income-card-action" @click="toggleExpand">
            <span>{{ incomeExpanded ? '点击收起' : '点击展开' }}</span>
            <svg
                class="action-arrow"
                :class="{ expanded: incomeExpanded }"
                width="10" height="6" viewBox="0 0 10 6" fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="#b1b1b1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <button class="card-arrow card-arrow--next" aria-label="下一项">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M1 1L7 7L1 13" stroke="#2EB8CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>


    <van-tabs v-model:active="chartMode" class="section-mode-tabs" :border="false">
      <van-tab title="收益趋势" name="trend" />
      <van-tab title="收益分布" name="distribution" />
    </van-tabs>

    <van-swipe
      ref="swipeRef"
      class="chart-swipe"
      :loop="false"
      :show-indicators="false"
      @change="onSwipeChange"
    >
      <van-swipe-item class="chart-swipe-item">
        <div class="trend-panel">
          <button
            class="period-arrow period-arrow--prev"
            :class="{ invisible: trendIndex === 0 }"
            :disabled="trendIndex === 0"
            aria-label="上一周期"
            @click="prevTrend"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7L7 13" stroke="#2EB8CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="trend-body">
            <TrendSwitchTabs :model-value="trendTab" @update:model-value="onTrendTabChange" />
            <div class="income-chart-wrap">
              <TrendChartCard class="income-chart-card" :points="trendPoints" />
              <div v-if="trendLoading" class="income-chart-loading" />
            </div>
          </div>
          <button
            class="period-arrow period-arrow--next"
            :class="{ invisible: trendIndex === TREND_OPTIONS.length - 1 }"
            :disabled="trendIndex === TREND_OPTIONS.length - 1"
            aria-label="下一周期"
            @click="nextTrend"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="#2EB8CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </van-swipe-item>
      <van-swipe-item class="chart-swipe-item">
        <DistributionSwitchTabs :model-value="distTab" :options="distOptions" @update:model-value="onDistTabChange" />
        <div class="income-chart-wrap">
          <DistributionPieLegend :items="distItems" />
          <div v-if="distLoading" class="income-chart-loading" />
        </div>
      </van-swipe-item>
    </van-swipe>
  </section>
</template>

<style scoped>
.income-block {
  display: flex;
  flex-direction: column;
  gap: calc(14 * 100vw / var(--nexa-design-width));
  width: calc(340 * 100vw / var(--nexa-design-width));
}
.income-block-body{
  display: flex;
  flex-direction: row;
}

.income-card-wrap {
  flex: 1;
  min-width: 0;
  position: relative;
}

.card-arrow {
  flex: 0 0 auto;
  width: calc(20 * 100vw / var(--nexa-design-width));
  align-self: stretch;
  display: flex;
  justify-content: center;
  background: transparent;
  border: none;
  padding-top: calc(30 * 100vw / var(--nexa-design-width));
  cursor: pointer;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.card-arrow--prev {
  left: calc(-20 * 100vw / var(--nexa-design-width));
  transform: translateX(calc(-5 * 100vw / var(--nexa-design-width)));
}

.card-arrow--next {
  right: calc(-10 * 100vw / var(--nexa-design-width));
  transform: translateX(calc(5 * 100vw / var(--nexa-design-width)));
}

.card-arrow:active svg path {
  stroke: var(--nexa-color-brand-primary);
}

.income-card {
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  overflow: hidden;
  border: 1px solid #3fbbfa;
  background: #fff;
}


.income-card-top {
  position: relative;
  height: calc(140 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0174ae 100%);
  color: #fff;
  text-align: center;
  padding-top: calc(10 * 100vw / var(--nexa-design-width));
}

.income-title {
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(34 * 100vw / var(--nexa-design-width));
}

.income-detail-btn {
  position: absolute;
  top: calc(12 * 100vw / var(--nexa-design-width));
  right: calc(10 * 100vw / var(--nexa-design-width));
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: calc(11 * 100vw / var(--nexa-design-width));
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.amount-row {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.amount {
  font-size: calc(30 * 100vw / var(--nexa-design-width));
  line-height: calc(44 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}

.unit {
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}

.income-card-body {
  padding: calc(8 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width)) 0;
  max-height: calc(200 * 100vw / var(--nexa-design-width));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.income-card-body.collapsed {
  max-height: 0;
  padding-top: 0;
  overflow-y: hidden;
}

.income-card-body :deep(.zspace-list-card) {
  border: 0;
  box-shadow: none;
  background: #f9faff;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  padding: calc(6 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
}

.income-card-body :deep(.van-cell-group) {
  background: #f9faff;
}

.income-card-body :deep(.van-cell) {
  padding: 0;
  background: transparent;
}

.income-card-body :deep(.zspace-head) {
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  margin-bottom: calc(4 * 100vw / var(--nexa-design-width));
}

.income-card-body :deep(.logo) {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
}

.income-card-body :deep(.name) {
  color: #0a81b4;
  font-weight: 700;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
}

.income-card-body :deep(.time) {
  color: #b1b1b1;
  font-size: calc(6 * 100vw / var(--nexa-design-width));
}

.income-card-body :deep(.amount) {
  color: #0a81b4;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
}

.income-card-body :deep(.amount-icon) {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
}

.income-card-action {
  width: 100%;
  height: calc(36 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(4 * 100vw / var(--nexa-design-width));
  background: transparent;
  border: none;
  font-size: calc(11 * 100vw / var(--nexa-design-width));
  color: #b1b1b1;
  cursor: pointer;
}

.action-arrow {
  transition: transform 0.3s ease;
  transform: rotate(0deg);
}

.action-arrow.expanded {
  transform: rotate(180deg);
}

.section-mode-tabs {
  margin-top: calc(4 * 100vw / var(--nexa-design-width));
}

.section-mode-tabs :deep(.van-tabs__wrap) {
  height: calc(32 * 100vw / var(--nexa-design-width));
}

.section-mode-tabs :deep(.van-tab) {
  flex: 0 0 auto;
  min-width: calc(64 * 100vw / var(--nexa-design-width));
  color: #7e818d;
  font-size: calc(11 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.section-mode-tabs :deep(.van-tab--active) {
  color: #000;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.section-mode-tabs :deep(.van-tabs__line) {
  display: none;
}

.section-mode-tabs :deep(.van-tabs__content) {
  display: none;
}

.chart-swipe {
  width: 100%;
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.chart-swipe :deep(.van-swipe__track) {
  align-items: flex-start;
}

.chart-swipe-item {
  height: auto !important;
  box-sizing: border-box;
}

.trend-panel {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0;
}
.period-arrow--prev{
  transform: translateX(calc(-5 * 100vw / var(--nexa-design-width)));
}
.period-arrow--next{
  transform: translateX(calc(5 * 100vw / var(--nexa-design-width)));
}
.period-arrow {
  flex: 0 0 auto;
  width: calc(20 * 100vw / var(--nexa-design-width));
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  padding-top: calc(10 * 100vw / var(--nexa-design-width));
  cursor: pointer;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.period-arrow:not(:disabled):active svg path {
  stroke: var(--nexa-color-brand-primary);
}

.period-arrow.invisible {
  opacity: 0.25;
  pointer-events: none;
}

.trend-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.income-chart-wrap {
  position: relative;
}

.income-chart-card {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.income-chart-loading {
  position: absolute;
  inset: 0;
  border-radius: var(--nexa-radius-sm);
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(2px);
}
</style>
