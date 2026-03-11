<script setup lang="ts">
import { ref } from 'vue';
import { message } from '@/utils/message';
import TrendSwitchTabs from '@/components/common/TrendSwitchTabs.vue';
import TrendChartCard from '@/components/common/TrendChartCard.vue';
import DistributionSwitchTabs from '@/components/common/DistributionSwitchTabs.vue';
import DistributionPieLegend from '@/components/common/DistributionPieLegend.vue';
import ZSpaceIncomeList from '@/components/home/ZSpaceIncomeList.vue';

// 中证空间收益区组件
// 负责：中证收益总卡片 + 收益列表 + 趋势/分布切换
// 不负责：页面标题、系统通知、收益类型主 tab

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
      { date: '4', value: 18 },
      { date: '5', value: 30 },
      { date: '6', value: 35 },
      { date: '7', value: 50 },
      { date: '8', value: 55 },
      { date: '9', value: 60 },
      { date: '10', value: 74 }
    ],
    trendLoading: false,
    distLoading: false,
    distOptions: () => ['地区分布', '性别分布', '消费分布'],
    distItems: () => [
      { name: '华东', value: '1200诺', percent: 48, color: '#1677ff' },
      { name: '华南', value: '800诺', percent: 32, color: '#45b7ff' },
      { name: '其他', value: '500诺', percent: 20, color: '#d9dee8' }
    ],
    listRows: () => [
      { merchantName: '中证推广商家A', time: '2026-02-10 03:13:10', amount: '0.8诺' },
      { merchantName: '中证推广商家B', time: '2026-02-10 03:13:10', amount: '0.6诺' },
      { merchantName: '中证推广商家C', time: '2026-02-10 03:13:10', amount: '0.5诺' },
      { merchantName: '中证推广商家D', time: '2026-02-10 03:13:10', amount: '0.4诺' },
      { merchantName: '中证推广商家E', time: '2026-02-10 03:13:10', amount: '0.3诺' },
      { merchantName: '中证推广商家F', time: '2026-02-10 03:13:10', amount: '0.2诺' }
    ]
  }
);

const emit = defineEmits<{
  (e: 'period-change', period: 7 | 30 | 90): void;
  (e: 'dist-change', tab: string): void;
}>();

const trendPeriodMap: Record<string, 7 | 30 | 90> = { '7日趋势': 7, '30日趋势': 30, '90日趋势': 90 };

const trendTab = ref('7日趋势');
const distTab = ref(props.distOptions[0] || '地区分布');

const onTrendTabChange = (val: string) => {
  trendTab.value = val;
  const period = trendPeriodMap[val];
  if (period) emit('period-change', period);
};

const onDistTabChange = (val: string) => {
  distTab.value = val;
  emit('dist-change', val);
};
const chartMode = ref<'trend' | 'distribution'>('trend');
const incomeExpanded = ref(false);

const toggleExpand = () => {
  incomeExpanded.value = !incomeExpanded.value;
};

const goDetail = () => {
  message.info('功能建设中');
};
</script>

<template>
  <section class="income-block">
    <div class="income-card">
      <div class="income-card-top">
        <div class="income-title">中证空间收益</div>
        <button class="income-detail-btn" @click="goDetail">查看详情 &gt;</button>
        <div class="amount-row">
          <span class="amount">{{ amount }}</span>
          <span class="unit">{{ unit }}</span>
        </div>
      </div>
      <div class="income-card-body" :class="{ collapsed: !incomeExpanded }">
        <ZSpaceIncomeList :rows="listRows" type="zspace" />
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

    <van-tabs v-model:active="chartMode" class="section-mode-tabs" :border="false">
      <van-tab title="收益趋势" name="trend" />
      <van-tab title="收益分布" name="distribution" />
    </van-tabs>

    <template v-if="chartMode === 'trend'">
      <TrendSwitchTabs :model-value="trendTab" @update:model-value="onTrendTabChange" />
      <div class="income-chart-wrap">
        <TrendChartCard class="income-chart-card" :points="trendPoints" />
        <div v-if="trendLoading" class="income-chart-loading" />
      </div>
    </template>
    <template v-else>
      <DistributionSwitchTabs :model-value="distTab" :options="distOptions" @update:model-value="onDistTabChange" />
      <div class="income-chart-wrap">
        <DistributionPieLegend :items="distItems" />
        <div v-if="distLoading" class="income-chart-loading" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.income-block {
  display: flex;
  flex-direction: column;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.income-card {
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  overflow: hidden;
  border: 1px solid #3fbbfa;
  background: #fff;
}

.income-card-top {
  position: relative;
  height: calc(120 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0174ae 100%);
  color: #fff;
  text-align: center;
  padding-top: calc(7 * 100vw / var(--nexa-design-width));
}

.income-title {
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(30 * 100vw / var(--nexa-design-width));
}

.income-detail-btn {
  position: absolute;
  top: calc(8 * 100vw / var(--nexa-design-width));
  right: calc(10 * 100vw / var(--nexa-design-width));
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: calc(8 * 100vw / var(--nexa-design-width));
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
  height: calc(28 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(4 * 100vw / var(--nexa-design-width));
  background: transparent;
  border: none;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
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
  margin-top: calc(2 * 100vw / var(--nexa-design-width));
}

.section-mode-tabs :deep(.van-tabs__wrap) {
  height: calc(24 * 100vw / var(--nexa-design-width));
}

.section-mode-tabs :deep(.van-tab) {
  flex: 0 0 auto;
  min-width: calc(56 * 100vw / var(--nexa-design-width));
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 600;
}

.section-mode-tabs :deep(.van-tab--active) {
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.section-mode-tabs :deep(.van-tabs__line) {
  display: none;
}

.section-mode-tabs :deep(.van-tabs__content) {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
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
