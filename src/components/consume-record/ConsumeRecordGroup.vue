<script setup lang="ts">
import ConsumeRecordItem from '@/components/consume-record/ConsumeRecordItem.vue';

// 消费记录日期分组
// props.dateLabel: 日期标题
// props.items: 当日明细列表
interface ConsumeRecordItemModel {
  id: string;
  typeLabel: string;
  timeText: string;
  amountText: string;
  amountClass: 'normal' | 'withdraw';
  statusText: string;
  statusClass: 'pending' | 'done';
}

const props = defineProps<{
  dateLabel: string;
  items: readonly ConsumeRecordItemModel[];
}>();
</script>

<template>
  <section class="consume-record-group">
    <div class="group-date">{{ props.dateLabel }}</div>
    <div class="group-list">
      <ConsumeRecordItem v-for="item in props.items" :key="item.id" :item="item" />
    </div>
  </section>
</template>

<style scoped>
.consume-record-group {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.group-date {
  color: #989c9e;
  font-size: calc(6 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: calc(4 * 100vw / var(--nexa-design-width));
}
</style>
