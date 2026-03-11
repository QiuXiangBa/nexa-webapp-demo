<script setup lang="ts">
import ContractRecordItem from '@/components/contract-record/ContractRecordItem.vue';

// 智能合约分组区块
// props.title: 分组标题（用户合约/商家合约/中证合约）
// props.items: 分组内合约列表
interface ContractRecordItemModel {
  id: string;
  title: string;
  signDate: string;
  actionText: string;
}

const props = defineProps<{
  title: string;
  items: readonly ContractRecordItemModel[];
  arrowIconUrl: string;
}>();

const emit = defineEmits<{
  select: [item: ContractRecordItemModel];
}>();
</script>

<template>
  <section class="contract-record-section">
    <div class="section-title">{{ props.title }}</div>
    <div class="section-list">
      <ContractRecordItem
        v-for="item in props.items"
        :key="item.id"
        :item="item"
        :arrow-icon-url="props.arrowIconUrl"
        @select="emit('select', item)"
      />
    </div>
  </section>
</template>

<style scoped>
.contract-record-section {
  width: calc(366 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  padding: 0 calc(13 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
}

.section-title {
  height: calc(30 * 100vw / var(--nexa-design-width));
  color: #3fbbfa;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  text-align: center;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}
</style>
