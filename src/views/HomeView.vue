<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { message } from '@/utils/message';
import { fetchHomeOverview, fetchTrendPoints, fetchDistItems, type HomeDistributionItem, type HomeOverview, type HomeTrendPoint } from '@/services/home';
import { parseError } from '@/services/http';
import { formatTime } from '@/utils/format';
import ConsumerIncomeBlock from '@/components/home/ConsumerIncomeBlock.vue';
import ZSpaceIncomeBlock from '@/components/home/ZSpaceIncomeBlock.vue';
import AppPageState, { type AppPageStateType } from '@/components/common/AppPageState.vue';

interface Notice {
  date: string;
  content: string;
}

const notices = ref<Notice[]>([
  { date: '2026-03-02', content: '通知主题：系统将于今晚 22:00 进行例行维护，请提前做好准备。' },
  { date: '2026-03-01', content: '公告：3月份消费收益结算已完成，请前往收益页面查看详情。' },
  { date: '2026-02-28', content: '提醒：您的商家认证即将到期，请及时前往"我的"页面续期。' }
]);

const noticeIndex = ref(0);
const loading = ref(false);
const loadError = ref('');
const overview = ref<HomeOverview | null>(null);
const activeTab = ref(0);
const incomeTabCount = 2;

const consumerTrendPoints = ref<HomeTrendPoint[]>([]);
const zspaceTrendPoints = ref<HomeTrendPoint[]>([]);
const consumerTrendLoading = ref(false);
const zspaceTrendLoading = ref(false);

const consumerDistItems = ref<HomeDistributionItem[]>([]);
const zspaceDistItems = ref<HomeDistributionItem[]>([]);
const consumerDistLoading = ref(false);
const zspaceDistLoading = ref(false);

const hasData = computed(() => Boolean(overview.value?.consumer || overview.value?.zspace));
const canSwitchPrevIncome = computed(() => activeTab.value > 0);
const canSwitchNextIncome = computed(() => activeTab.value < incomeTabCount - 1);
const pageState = computed<AppPageStateType>(() => {
  if (loading.value) return 'loading';
  if (loadError.value) return 'error';
  if (!hasData.value) return 'empty';
  return 'ready';
});

// 主收益区箭头与标题 tab 复用同一状态，保证点击箭头、点击标题、手势滑动三种交互一致。
const switchIncomeTab = (step: -1 | 1) => {
  const nextIndex = activeTab.value + step;
  if (nextIndex < 0 || nextIndex >= incomeTabCount) {
    return;
  }
  activeTab.value = nextIndex;
};

const formatListTime = (ts?: number) => {
  const raw = formatTime(ts);
  return raw.includes(' ') ? raw.replace(' ', '\n') : raw;
};

const ensureDistribution = (items: HomeDistributionItem[]) => {
  if (items.length) return items;
  return [{ name: '暂无数据', value: '0诺', percent: 100, color: '#1677ff' }];
};

const mapTrendPoints = (points: HomeTrendPoint[]) =>
  points.map((item) => ({ date: item.date, value: Number(item.value) || 0 }));

const consumerProps = computed(() => {
  const section = overview.value?.consumer;
  const listRows = (section?.listItems || []).map((item) => ({
    merchantName: item.merchantName,
    time: formatListTime(item.time),
    amount: item.amount,
    logo: '/pages/home/08a03f0d-6706-4f0c-8c5f-c60eb6e08e2e.jpg'
  }));
  return {
    amount: section?.amount || '0',
    trendPoints: mapTrendPoints(consumerTrendPoints.value),
    trendLoading: consumerTrendLoading.value,
    distOptions: section?.distOptions || ['消费类型', '消费地区'],
    distItems: ensureDistribution(consumerDistItems.value.length ? consumerDistItems.value : (section?.distItems || [])),
    distLoading: consumerDistLoading.value,
    listRows
  };
});

const zspaceProps = computed(() => {
  const section = overview.value?.zspace;
  const listRows = (section?.listItems || []).map((item) => ({
    merchantName: item.merchantName,
    time: formatListTime(item.time),
    amount: item.amount,
    logo: '/pages/home/e31c082d-5f91-42c6-ba09-3d094c2ad1ff.svg'
  }));
  return {
    amount: section?.amount || '0',
    trendPoints: mapTrendPoints(zspaceTrendPoints.value),
    trendLoading: zspaceTrendLoading.value,
    distOptions: section?.distOptions || ['地区分布', '性别分布', '消费分布'],
    distItems: ensureDistribution(zspaceDistItems.value.length ? zspaceDistItems.value : (section?.distItems || [])),
    distLoading: zspaceDistLoading.value,
    listRows
  };
});

const onConsumerPeriodChange = async (period: 7 | 30 | 90) => {
  consumerTrendLoading.value = true;
  try {
    consumerTrendPoints.value = await fetchTrendPoints('consumer', period);
  } catch (error) {
    message.error(parseError(error, '加载趋势数据失败'));
  } finally {
    consumerTrendLoading.value = false;
  }
};

const onConsumerDistChange = async (tab: string) => {
  consumerDistLoading.value = true;
  try {
    consumerDistItems.value = await fetchDistItems('consumer', tab);
  } catch (error) {
    message.error(parseError(error, '加载分布数据失败'));
  } finally {
    consumerDistLoading.value = false;
  }
};

const onZspaceDistChange = async (tab: string) => {
  zspaceDistLoading.value = true;
  try {
    zspaceDistItems.value = await fetchDistItems('zspace', tab);
  } catch (error) {
    message.error(parseError(error, '加载分布数据失败'));
  } finally {
    zspaceDistLoading.value = false;
  }
};

const onZspacePeriodChange = async (period: 7 | 30 | 90) => {
  zspaceTrendLoading.value = true;
  try {
    zspaceTrendPoints.value = await fetchTrendPoints('zspace', period);
  } catch (error) {
    message.error(parseError(error, '加载趋势数据失败'));
  } finally {
    zspaceTrendLoading.value = false;
  }
};

const load = async () => {
  loading.value = true;
  loadError.value = '';
  try {
    overview.value = await fetchHomeOverview();
    // 初始化 7 日趋势数据
    consumerTrendPoints.value = overview.value.consumer?.trendPoints || [];
    zspaceTrendPoints.value = overview.value.zspace?.trendPoints || [];
  } catch (error) {
    loadError.value = parseError(error, '加载首页数据失败');
    message.error(loadError.value);
    overview.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void load();
});
</script>

<template>
  <!-- 首页（Figma node: 31:2067）
    负责：标题/通知条、收益类型切换、收益卡与趋势分布编排
    不负责：全局底部导航和路由壳层（由 LayoutView 管理） -->
  <div class="home-page">
    <section class="home-header-section">
      <h1 class="home-title">数字资产收益</h1>
      <van-swipe
        class="home-notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
        vertical
        @change="(i) => noticeIndex = i"
      >
        <van-swipe-item v-for="(notice, i) in notices" :key="i" class="home-notice">
          <div class="home-notice-top">
            <span class="home-notice-tag">系统通知</span>
            <span class="home-notice-date">{{ notice.date }}</span>
          </div>
          <div class="home-notice-content-wrap">
            <div class="home-notice-content">{{ notice.content }}</div>
            <span class="home-notice-arrow">&gt;</span>
          </div>
        </van-swipe-item>
      </van-swipe>
    </section>

    <AppPageState
      :state="pageState"
      :error-description="loadError || '加载首页数据失败'"
      empty-description="暂无首页数据"
      :skeleton-rows="6"
      :min-height="300"
      @retry="load"
    >
      <div class="home-income-tabs-wrap">
        <van-tabs v-model:active="activeTab" class="home-income-tabs" :border="false" :lazy-render="false" animated swipeable>
          <van-tab title="消费收益">
            <ConsumerIncomeBlock v-bind="consumerProps" @period-change="onConsumerPeriodChange" @dist-change="onConsumerDistChange" />
          </van-tab>
          <van-tab title="中证收益">
            <ZSpaceIncomeBlock v-bind="zspaceProps" @period-change="onZspacePeriodChange" @dist-change="onZspaceDistChange" />
          </van-tab>
        </van-tabs>
      </div>
    </AppPageState>

  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: calc(20 * 100vw / var(--nexa-design-width));
}

.home-header-section {
  display: flex;
  flex-direction: column;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.home-title {
  margin: 0;
  text-align: center;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  color: var(--nexa-color-black);
}

.home-notice-swipe {
  width: calc(340 * 100vw / var(--nexa-design-width));
  height: calc(50 * 100vw / var(--nexa-design-width));
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  border: 1px solid var(--nexa-color-brand-primary);
  background: var(--nexa-color-surface-card);
}

.home-notice {
  height: 100%;
  padding: calc(6 * 100vw / var(--nexa-design-width)) calc(8 * 100vw / var(--nexa-design-width));
}

.home-notice-top {
  display: flex;
  align-items: center;
  gap: calc(6 * 100vw / var(--nexa-design-width));
}

.home-notice-tag {
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  color: var(--nexa-color-black);
  font-weight: 700;
}

.home-notice-date {
  font-size: calc(6 * 100vw / var(--nexa-design-width));
  color: #b0b0b0;
}

.home-notice-content {
  font-size: calc(6 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
  color: var(--nexa-color-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-notice-content-wrap {
  margin-top: calc(2 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(4 * 100vw / var(--nexa-design-width));
}

.home-notice-arrow {
  flex: none;
  color: var(--nexa-color-black);
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}

.home-dot-indicator {
  align-self: center;
  display: flex;
  align-items: center;
  gap: calc(4 * 100vw / var(--nexa-design-width));
}

.home-dot-indicator span {
  width: calc(4 * 100vw / var(--nexa-design-width));
  height: calc(3 * 100vw / var(--nexa-design-width));
  border-radius: calc(20 * 100vw / var(--nexa-design-width));
  background: #d9d9d9;
}

.home-dot-indicator span.active {
  width: calc(14 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-brand-primary);
}

.home-income-tabs :deep(.van-tabs__wrap) {
  height: calc(38 * 100vw / var(--nexa-design-width));
}

.home-income-tabs :deep(.van-tabs__nav) {
  background: transparent;
  padding: 0;
}

.home-income-tabs :deep(.van-tab) {
  flex: 0 0 auto;
  padding: 0;
  margin-right: calc(22 * 100vw / var(--nexa-design-width));
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(38 * 100vw / var(--nexa-design-width));
  color: var(--nexa-color-text-tertiary);
  font-weight: 600;
  transition: font-size 0.2s;
}

.home-income-tabs :deep(.van-tab--active) {
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  color: var(--nexa-color-black);
  font-weight: 700;
}

.home-income-tabs :deep(.van-tabs__line) {
  display: none;
}

.home-income-tabs :deep(.van-tabs__content) {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.home-income-tabs-wrap {
  position: relative;
}

.home-income-switch {
  position: absolute;
  top: calc(120 * 100vw / var(--nexa-design-width));
  transform: translateY(-50%);
  width: calc(32 * 100vw / var(--nexa-design-width));
  height: calc(32 * 100vw / var(--nexa-design-width));
  border: none;
  background: transparent;
  color: #2ab5d3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.home-income-switch:focus-visible {
  outline: 2px solid rgba(42, 181, 211, 0.35);
  outline-offset: 2px;
  border-radius: 50%;
}

.home-income-switch:disabled {
  opacity: 0.35;
  cursor: default;
}

.home-income-switch-prev {
  left: calc(-30 * 100vw / var(--nexa-design-width));
}

.home-income-switch-next {
  right: calc(-20 * 100vw / var(--nexa-design-width));
}

.home-income-switch-icon {
  width: calc(8 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
}

.home-income-switch-icon-left {
  transform: rotate(180deg);
}

/* animated+swipeable 模式内部用 van-swipe 通过 JS 测量宽度，
   强制 100% 确保面板宽度与容器一致，避免左右边距不等 */
.home-income-tabs :deep(.van-swipe),
.home-income-tabs :deep(.van-swipe-item) {
  width: 100%;
}
</style>
