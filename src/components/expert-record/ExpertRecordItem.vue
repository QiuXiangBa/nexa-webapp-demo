<script setup lang="ts">
// 达人授权记录行
// props.item: 单条授权记录
interface ExpertRecordItem {
  id: string;
  nickname: string;
  authTypeText: string;
  statusText: string;
  statusClass: 'pending' | 'pass' | 'reject';
}

const props = defineProps<{
  item: ExpertRecordItem;
}>();
</script>

<template>
  <div class="expert-record-item">
    <span class="cell nickname">{{ props.item.nickname }}</span>
    <span class="cell auth-type">{{ props.item.authTypeText }}</span>
    <span class="cell status" :class="props.item.statusClass">{{ props.item.statusText }}</span>
  </div>
</template>

<style scoped>
.expert-record-item {
  width: 100%;
  height: calc(36 * 100vw / var(--nexa-design-width));
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: #fff;
  padding: 0 calc(14 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: calc(72 * 100vw / var(--nexa-design-width)) 1fr calc(60 * 100vw / var(--nexa-design-width));
  align-items: center;
}

.cell {
  color: #989c9e;
  line-height: 1;
  white-space: nowrap;
}

.nickname {
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.auth-type {
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.status {
  text-align: right;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.status.pending {
  color: #989c9e;
}

.status.pass {
  color: #06a600;
}

.status.reject {
  color: #ff0000;
}
</style>
