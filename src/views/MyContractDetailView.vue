<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';
import ContractSignPaper from '@/components/contract-sign/ContractSignPaper.vue';
import ContractSignActionBar from '@/components/contract-sign/ContractSignActionBar.vue';
import {
  contractMainTitle,
  contractMetaLines,
  contractPartOneClauses,
  contractPartTwoClauses,
  contractPartTwoIntro
} from '@/components/contract-sign/contractContent';

// 我的智能合约详情页（Figma node: 54:3100）
// 负责：展示链上智能合约正文和底部返回动作
// 不负责：底部导航和全局壳层（由 LayoutView 管理）
const router = useRouter();

const onBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }
  void router.push('/me/contracts');
};
</script>

<template>
  <div class="my-contract-detail-page">
    <AppTopBarStandard title="链上智能合约" subtitle="加入数字资产分发网络，获得长期链上收益" fallback-path="/me/contracts" />

    <main class="my-contract-detail-main">
      <ContractSignPaper
        :main-title="contractMainTitle"
        :meta-lines="contractMetaLines"
        :part-one-clauses="contractPartOneClauses"
        :part-two-intro="contractPartTwoIntro"
        :part-two-clauses="contractPartTwoClauses"
      />
    </main>

    <ContractSignActionBar :button-text="'返回'" @submit="onBack" />
  </div>
</template>

<style scoped>
.my-contract-detail-page {
  min-height: 100dvh;
  background: #f4f6f9;
  padding-top: calc(var(--nexa-topbar-rich-total-height) + env(safe-area-inset-top));
}

.my-contract-detail-main {
  padding-bottom: calc(14 * 100vw / var(--nexa-design-width));
}
</style>
