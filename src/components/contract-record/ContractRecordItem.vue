<script setup lang="ts">
// 智能合约记录行
// props.item: 单条合约数据
interface ContractRecordItem {
  id: string;
  title: string;
  signDate: string;
  actionText: string;
}

const props = defineProps<{
  item: ContractRecordItem;
  arrowIconUrl: string;
}>();

const emit = defineEmits<{
  select: [item: ContractRecordItem];
}>();
</script>

<template>
  <button type="button" class="contract-record-item" @click="emit('select', props.item)">
    <div class="item-left">{{ props.item.title }}</div>
    <div class="item-right">
      <div class="item-date">{{ props.item.signDate }}</div>
      <div class="item-action-row">
        <span class="item-action">{{ props.item.actionText }}</span>
        <img :src="props.arrowIconUrl" alt="" class="item-arrow" />
      </div>
    </div>
  </button>
</template>

<style scoped>
.contract-record-item {
  width: 100%;
  height: calc(50 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: #f9faff;
  padding: 0 calc(10 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-left {
  color: #363636;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  text-align: left;
}

.item-right {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-date {
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(16 * 100vw / var(--nexa-design-width));
}

.item-action-row {
  display: inline-flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.item-action {
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(33 * 100vw / var(--nexa-design-width));
}

.item-arrow {
  width: calc(4 * 100vw / var(--nexa-design-width));
  height: calc(8 * 100vw / var(--nexa-design-width));
}
</style>
