<script setup lang="ts">
import ExpertRecordItem from '@/components/expert-record/ExpertRecordItem.vue';

// 达人授权日期分组
// props.dateLabel: 日期
// props.items: 该日期下授权记录
interface ExpertRecordItemModel {
  id: string;
  nickname: string;
  authTypeText: string;
  statusText: string;
  statusClass: 'pending' | 'pass' | 'reject';
}

const props = defineProps<{
  dateLabel: string;
  items: readonly ExpertRecordItemModel[];
}>();
</script>

<template>
  <section class="expert-record-group">
    <div class="group-date">{{ props.dateLabel }}</div>
    <div class="group-list">
      <ExpertRecordItem v-for="item in props.items" :key="item.id" :item="item" />
    </div>
  </section>
</template>

<style scoped>
.expert-record-group {
  display: flex;
  flex-direction: column;
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
  gap: calc(8 * 100vw / var(--nexa-design-width));
}
</style>
