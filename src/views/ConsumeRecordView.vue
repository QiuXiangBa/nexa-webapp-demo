<script setup lang="ts">
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';
import ConsumeRecordGroup from '@/components/consume-record/ConsumeRecordGroup.vue';

// 消费记录页（Figma node: 54:2847）
// 负责：收益明细记录分组展示
// 不负责：底部导航和全局壳层（由 LayoutView 管理）
const groups = [
  {
    dateLabel: '2026年02月03日',
    items: [
      { id: 'r-1', typeLabel: '消费收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '待入帐', statusClass: 'pending' },
      { id: 'r-2', typeLabel: '分润收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '已完成', statusClass: 'done' },
      { id: 'r-3', typeLabel: '结算提现', timeText: '2026-02-03  14:01:12', amountText: '-55.00', amountClass: 'withdraw', statusText: '已完成', statusClass: 'done' },
      { id: 'r-4', typeLabel: '分润收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '已完成', statusClass: 'done' }
    ]
  },
  {
    dateLabel: '2026年02月02日',
    items: [
      { id: 'r-5', typeLabel: '结算提现', timeText: '2026-02-03  14:01:12', amountText: '-55.00', amountClass: 'withdraw', statusText: '已完成', statusClass: 'done' },
      { id: 'r-6', typeLabel: '分润收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '已完成', statusClass: 'done' }
    ]
  },
  {
    dateLabel: '2026年02月01日',
    items: [
      { id: 'r-7', typeLabel: '分润收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '已完成', statusClass: 'done' },
      { id: 'r-8', typeLabel: '结算提现', timeText: '2026-02-03  14:01:12', amountText: '-55.00', amountClass: 'withdraw', statusText: '已完成', statusClass: 'done' },
      { id: 'r-9', typeLabel: '消费收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '已完成', statusClass: 'done' },
      { id: 'r-10', typeLabel: '结算提现', timeText: '2026-02-03  14:01:12', amountText: '-55.00', amountClass: 'withdraw', statusText: '已完成', statusClass: 'done' },
      { id: 'r-11', typeLabel: '结算提现', timeText: '2026-02-03  14:01:12', amountText: '-55.00', amountClass: 'withdraw', statusText: '已完成', statusClass: 'done' },
      { id: 'r-12', typeLabel: '消费收益', timeText: '2026-02-03  14:01:12', amountText: '55.00', amountClass: 'normal', statusText: '已完成', statusClass: 'done' }
    ]
  }
] as const;
</script>

<template>
  <div class="consume-record-page">
    <AppTopBarStandard title="收益明细记录" fallback-path="/me" />

    <section class="record-panel-wrap">
      <div class="record-panel">
        <div class="record-inner">
          <ConsumeRecordGroup v-for="group in groups" :key="group.dateLabel" :date-label="group.dateLabel" :items="group.items" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.consume-record-page {
  min-height: 100dvh;
  background: #f9faff;
  padding-top: calc(70 * 100vw / var(--nexa-design-width));
}

.record-panel-wrap {
  display: flex;
  justify-content: center;
}

.record-panel {
  width: calc(354 * 100vw / var(--nexa-design-width));
  border-radius: calc(20 * 100vw / var(--nexa-design-width));
  background: #fff;
  display: flex;
  justify-content: center;
  padding-top: calc(17 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(17 * 100vw / var(--nexa-design-width));
}

.record-inner {
  width: calc(330 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width)) 0 0;
  background: #f9faff;
  padding: calc(10 * 100vw / var(--nexa-design-width)) calc(14 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(20 * 100vw / var(--nexa-design-width));
}
</style>
