<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppBizImage from '@/components/common/AppBizImage.vue';

const props = withDefaults(
  defineProps<{
    rows: Array<{ logo?: string; merchantName: string; time: string; amount: string; amountIcon?: string }>;
    type?: 'consumer' | 'zspace';
  }>(),
  { type: 'consumer' }
);

const router = useRouter();
const defaultAmountIcon = '/pages/home/104186dc-32b5-4907-a980-7eacefe4989d.svg';
const goDetail = () => {
  router.push(props.type === 'zspace' ? '/home/zspace-income-detail' : '/home/consumer-income-detail');
};
</script>

<template>
  <!-- 首页收益商家列表：按 Figma 31:2172 对齐，统一三列（商家/时间/收益） -->
  <van-cell-group :border="false" class="zspace-list-card">
    <van-cell :border="false" class="zspace-cell zspace-head-cell">
      <div class="zspace-head">
        <span class="merchant-head">商家</span>
        <span class="time-head">时间</span>
        <span class="amount-head">收益</span>
      </div>
    </van-cell>
    <van-cell
      v-for="(row, idx) in rows"
      :key="`${row.merchantName}-${row.time}`"
      :border="false"
      clickable
      class="zspace-cell"
      :class="{ 'row-with-divider': idx > 0 }"
      @click="goDetail"
    >
      <div class="zspace-row">
        <span class="merchant">
          <AppBizImage :src="row.logo" fallback-src="/pages/common/logo-fallback.svg" alt="" class="logo" />
          <span class="name">{{ row.merchantName }}</span>
        </span>
        <span class="time">{{ row.time }}</span>
        <span class="amount-wrap">
          <span class="amount">{{ row.amount }}</span>
          <AppBizImage :src="row.amountIcon || defaultAmountIcon" alt="" class="amount-icon" />
        </span>
      </div>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.zspace-list-card {
  border-radius: 10px;
  background: transparent;
}

.zspace-cell {
  padding: 0;
  background: transparent;
}

.zspace-cell :deep(.van-cell__value) {
  padding: 0;
}

.zspace-head,
.zspace-row {
  display: grid;
  /* 三列表格列宽按 390 基准换算，避免“消费金额”列导致布局偏移 */
  grid-template-columns:
    calc(104 * 100vw / var(--nexa-design-width))
    calc(92 * 100vw / var(--nexa-design-width))
    1fr;
  align-items: center;
  gap: calc(4 * 100vw / var(--nexa-design-width));
}
.zspace-head {
  color: #94a3b8;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  margin-bottom: calc(4 * 100vw / var(--nexa-design-width));
}

.zspace-head-cell {
  min-height: 0;
}
.merchant-head{
  text-align: left;
}

.time-head {
  text-align: left;
}

.amount-head {
  text-align: right;
}

.merchant {
  display: inline-flex;
  align-items: center;
  gap: calc(6 * 100vw / var(--nexa-design-width));
  min-width: 0;
  overflow: hidden;
}

.logo {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
  flex: none;
}

.logo :deep(.van-image__img) {
  object-fit: cover;
}

.name {
  color: #0a81b4;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  color: #b1b1b1;
  font-size: calc(6 * 100vw / var(--nexa-design-width));
  white-space: pre-line;
  line-height: calc(8 * 100vw / var(--nexa-design-width));
  text-align: left;
}

.amount {
  color: #0a81b4;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.amount-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(2 * 100vw / var(--nexa-design-width));
}

.zspace-row {
  min-height: calc(30 * 100vw / var(--nexa-design-width));
}

.row-with-divider .zspace-row {
  border-top: 0.6px solid #b1b1b1;
}

.amount-icon {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
}

.amount-icon :deep(.van-image__img) {
  object-fit: cover;
}
</style>
