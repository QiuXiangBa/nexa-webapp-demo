<script setup lang="ts">
// 消费记录行组件
// props.item: 单条收益/提现明细
interface ConsumeRecordItem {
  id: string;
  typeLabel: string;
  timeText: string;
  amountText: string;
  amountClass: 'normal' | 'withdraw';
  statusText: string;
  statusClass: 'pending' | 'done';
}

const props = defineProps<{
  item: ConsumeRecordItem;
}>();
</script>

<template>
  <div class="consume-record-item">
    <div class="item-left">
      <span class="item-type" :class="{ withdraw: props.item.amountClass === 'withdraw' }">{{ props.item.typeLabel }}</span>
      <span class="item-time">{{ props.item.timeText }}</span>
    </div>

    <div class="item-right">
      <div class="item-amount" :class="{ withdraw: props.item.amountClass === 'withdraw' }">• {{ props.item.amountText }}</div>
      <div class="item-status" :class="props.item.statusClass">{{ props.item.statusText }}</div>
    </div>
  </div>
</template>

<style scoped>
.consume-record-item {
  width: 100%;
  height: calc(36 * 100vw / var(--nexa-design-width));
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: #fff;
  padding: 0 calc(10 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-left {
  display: inline-flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.item-type {
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.item-type.withdraw {
  color: #3fbbfa;
}

.item-time {
  color: #989c9e;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
}

.item-right {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.item-amount {
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(16 * 100vw / var(--nexa-design-width));
}

.item-amount.withdraw {
  color: #3fbbfa;
}

.item-status {
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(16 * 100vw / var(--nexa-design-width));
}

.item-status.pending {
  color: #363636;
}

.item-status.done {
  color: #06a600;
}
</style>
