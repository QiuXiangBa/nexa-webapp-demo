<script setup lang="ts">
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';
import { useRouter } from 'vue-router';
import ContractRecordSection from '@/components/contract-record/ContractRecordSection.vue';

// 我的智能合约页（Figma node: 54:2932）
// 负责：按合约类型分组展示合约列表
// 不负责：底部导航和全局壳层（由 LayoutView 管理）
const router = useRouter();
const arrowIconUrl = '/pages/my-contract/9473b956-af6e-4f63-8672-a13429d9557e.svg';

const sections = [
  {
    title: '用户合约',
    items: [
      { id: 'u-1', title: '数字资产用户合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' },
      { id: 'u-2', title: '数字资产达人合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' }
    ]
  },
  {
    title: '商家合约',
    items: [
      { id: 'm-1', title: '数字资产发行合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' },
      { id: 'm-2', title: '数字资产其他合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' }
    ]
  },
  {
    title: '中证合约',
    items: [
      { id: 'z-1', title: '中证数字资产合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' },
      { id: 'z-2', title: '中证数字资产合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' },
      { id: 'z-3', title: '中证数字资产合约', signDate: '2026年2月13日签约', actionText: '点击查看详情' }
    ]
  }
] as const;

const onSelectContract = (item: { id: string; title: string }) => {
  router.push({
    path: '/me/contracts/detail',
    query: { contractId: item.id, title: item.title }
  }).catch(() => undefined);
};
</script>

<template>
  <div class="my-contract-page">
    <AppTopBarStandard title="我的智能合约" fallback-path="/me" />

    <section class="section-list-wrap">
      <ContractRecordSection
        v-for="section in sections"
        :key="section.title"
        :title="section.title"
        :items="section.items"
        :arrow-icon-url="arrowIconUrl"
        @select="onSelectContract"
      />
    </section>
  </div>
</template>

<style scoped>
.my-contract-page {
  min-height: 100dvh;
  background: #f9faff;
  padding-top: calc(70 * 100vw / var(--nexa-design-width));
}

.section-list-wrap {
  margin-top: calc(0 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(20 * 100vw / var(--nexa-design-width));
}
</style>
