<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from '@/utils/message';
import { useRoute, useRouter } from 'vue-router';
import { parseError } from '@/services/http';
import { signContract } from '@/services/contract';
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

// 智能合约签署页（Figma node: 118:322）
// 负责：展示链上智能合约文本与签署动作
// 不负责：全局底部导航与主壳层（本页面为独立子页面）
const route = useRoute();
const router = useRouter();

const loading = ref(false);

const contractId = computed(() => {
  const raw = route.query.contractId;
  if (typeof raw === 'string' && /^\d+$/.test(raw)) {
    return Number(raw);
  }
  return 0;
});

const onConfirmSign = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    if (contractId.value > 0) {
      await signContract(contractId.value);
    }
    message.success('智能合约签署成功');
    // window.location.replace('/space')
    router.push('/space');
  } catch (error) {
    message.error(parseError(error, '智能合约签署失败'));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="contract-sign-page">
    <AppTopBarStandard title="链上智能合约" subtitle="加入数字资产分发网络，获得长期链上收益" fallback-path="/me" />

    <main class="contract-sign-main">
      <ContractSignPaper
        :main-title="contractMainTitle"
        :meta-lines="contractMetaLines"
        :part-one-clauses="contractPartOneClauses"
        :part-two-intro="contractPartTwoIntro"
        :part-two-clauses="contractPartTwoClauses"
      />
    </main>

    <ContractSignActionBar :loading="loading" :button-text="'同意并签署智能合约'" @submit="onConfirmSign" />
  </div>
</template>

<style scoped>
.contract-sign-page {
  min-height: 100dvh;
  background: #f4f6f9;
  padding-top: calc(var(--nexa-topbar-rich-total-height) + env(safe-area-inset-top));
}

.contract-sign-main {
  padding-bottom: calc(14 * 100vw / var(--nexa-design-width));
}
</style>
